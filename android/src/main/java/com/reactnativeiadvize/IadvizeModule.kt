package com.reactnativeiadvize

import android.graphics.Color
import android.graphics.drawable.Drawable
import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.iadvize.conversation.sdk.IAdvizeSDK
import com.iadvize.conversation.sdk.feature.conversation.ConversationListener
import com.iadvize.conversation.sdk.feature.targeting.TargetingListener
import com.iadvize.conversation.sdk.IAdvizeSDK.Callback
import com.iadvize.conversation.sdk.feature.authentication.AuthenticationOption
import com.iadvize.conversation.sdk.feature.chatbox.ChatboxConfiguration
import com.iadvize.conversation.sdk.feature.conversation.IncomingMessageAvatar
import com.iadvize.conversation.sdk.feature.conversation.ConversationChannel
import com.iadvize.conversation.sdk.feature.conversation.OngoingConversation
import com.iadvize.conversation.sdk.feature.defaultfloatingbutton.*
import com.iadvize.conversation.sdk.feature.gdpr.GDPREnabledOption
import com.iadvize.conversation.sdk.feature.gdpr.GDPROption
import com.iadvize.conversation.sdk.feature.targeting.LanguageOption
import com.iadvize.conversation.sdk.feature.targeting.TargetingRule
import com.iadvize.conversation.sdk.feature.targeting.NavigationOption
import com.iadvize.conversation.sdk.feature.transaction.Transaction
import com.iadvize.conversation.sdk.type.Language
import com.iadvize.conversation.sdk.feature.logger.Logger
import com.iadvize.conversation.sdk.type.Currency
import java.lang.Runnable
import java.net.URI
import java.net.URL
import java.util.*
import javax.annotation.Nullable

inline fun <T> tryOrNull(f: () -> T) =
    try {
        f()
    } catch (_: Exception) {
        null
    }

fun runOnUiThread(function: () -> Unit) {
    UiThreadUtil.runOnUiThread(object : Runnable {
        override fun run() {
            function.invoke()
        }
    })
}

class IadvizeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val TAG: String = "iAdvize SDK"
    }

    override fun getName(): String = "Iadvize"

    /*
      Activation
     */
    @ReactMethod
    fun activate(projectId: Int, userId: String, legalInfoUrl: String?, promise: Promise) {
        runOnUiThread {
            Log.d(TAG, "activate")

            val authOption =
                if (userId.isNotBlank()) AuthenticationOption.Simple(userId)
                else AuthenticationOption.Anonymous
            val legalUrl =
                if (legalInfoUrl.isNullOrBlank()) null
                else tryOrNull { URI(legalInfoUrl) }
            val gdprOption = legalUrl?.let { GDPROption.Enabled(GDPREnabledOption.LegalUrl(it)) }
                ?: GDPROption.Disabled

            IAdvizeSDK.activate(
                projectId,
                authOption,
                gdprOption,
                object : Callback {
                    override fun onSuccess() {
                        Log.d(TAG, "activate onSuccess")
                        promise.resolve(true)
                    }

                    override fun onFailure(t: Throwable) {
                        Log.d(TAG, "activate onFailure ${t.toString()}")
                        promise.reject("1", t.toString())
                    }
                }
            )
        }
    }

    /*
      Logging
     */
    @ReactMethod
    fun setLogLevel(logLevel: Int) {
        runOnUiThread {
            Log.d(TAG, "setLogLevel to ${logLevel.toString()}")
            IAdvizeSDK.logLevel = logLevelFrom(logLevel)
        }
    }

    fun logLevelFrom(value: Int): Logger.Level {
        when (value) {
            0 -> return Logger.Level.VERBOSE
            1 -> return Logger.Level.INFO
            2 -> return Logger.Level.WARNING
            3 -> return Logger.Level.ERROR
            else -> return Logger.Level.WARNING
        }
    }

    /*
      Targeting
     */
    @ReactMethod
    fun setLanguage(language: String) {
        runOnUiThread {
            Log.d(TAG, "setLanguage to $language")
            var lang = tryOrNull { Language.valueOf(language) } ?: Language.en
            IAdvizeSDK.targetingController.language = LanguageOption.Custom(lang)
        }
    }

    @ReactMethod
    fun activateTargetingRule(uuid: String, channel: String) {
        runOnUiThread {
            var value = UUID.fromString(uuid)
            Log.d(TAG, "activate targeting rule ${value.toString()}")

            IAdvizeSDK.targetingController.activateTargetingRule(
                TargetingRule(
                    value,
                    conversationChannelFrom(channel)
                )
            )
        }
    }

    fun conversationChannelFrom(value: String): ConversationChannel = when (value) {
        "chat" -> ConversationChannel.CHAT
        "video" -> ConversationChannel.VIDEO
        else -> ConversationChannel.CHAT
    }

    fun conversationChannelToString(value: ConversationChannel): String = when (value) {
        ConversationChannel.CHAT -> "chat"
        ConversationChannel.VIDEO -> "video"
        else -> "chat"
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun isActiveTargetingRuleAvailable(): Boolean =
        IAdvizeSDK.targetingController.isActiveTargetingRuleAvailable()

    @ReactMethod
    fun setOnActiveTargetingRuleAvailabilityListener() {
        runOnUiThread {
            Log.d(TAG, "setOnActiveTargetingRuleAvailabilityListener")

            IAdvizeSDK.targetingController.listeners.add(object : TargetingListener {
                override fun onActiveTargetingRuleAvailabilityUpdated(isActiveTargetingRuleAvailable: Boolean) {
                    val result = Arguments.createMap()
                    result.putBoolean(
                        "isActiveTargetingRuleAvailable",
                        isActiveTargetingRuleAvailable
                    );
                    sendEvent(
                        getReactApplicationContext(),
                        "iadvize_activeTargetingRuleAvailabilityUpdated",
                        result
                    );
                }
            })
        }
    }

    @ReactMethod
    fun registerUserNavigation(navigationOption: String, uuid: String, channel: String) {
        runOnUiThread {
            Log.d(TAG, "registerUserNavigation")

            IAdvizeSDK.targetingController.registerUserNavigation(
                navigationOptionFrom(
                    navigationOption,
                    uuid,
                    channel
                )
            )
        }
    }

    fun navigationOptionFrom(
        navigationOption: String,
        uuid: String,
        channel: String
    ): NavigationOption =
        when (navigationOption) {
            "clear" -> NavigationOption.ClearActiveRule
            "keep" -> NavigationOption.KeepActiveRule
            "new" -> NavigationOption.ActivateNewRule(
                TargetingRule(
                    UUID.fromString(uuid),
                    conversationChannelFrom(channel)
                )
            )
            else -> NavigationOption.ClearActiveRule
        }

    /*
      Conversation
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun ongoingConversationId(): String {
        Log.d(TAG, "ongoingConversationId called")
        return IAdvizeSDK.conversationController.ongoingConversation()?.conversationId ?: ""
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun ongoingConversationChannel(): String {
        Log.d(TAG, "ongoingConversationChannel called")
        val channel = (IAdvizeSDK.conversationController.ongoingConversation()?.conversationChannel) ?: ConversationChannel.CHAT
        return conversationChannelToString(channel)
    }

    @ReactMethod
    fun setConversationListener() {
        runOnUiThread {
            Log.d(TAG, "setConversationListener")

            IAdvizeSDK.conversationController.listeners.add(object : ConversationListener {
                override fun onOngoingConversationUpdated(ongoingConversation: OngoingConversation?) {
                    Log.d(TAG, "onOngoingConversationUpdated $ongoingConversation")
                    val result = Arguments.createMap()
                    result.putBoolean("hasOngoingConversation", ongoingConversation != null);
                    sendEvent(
                        getReactApplicationContext(),
                        "iadvize_onOngoingConversationStatusChanged",
                        result
                    );
                }

                override fun onNewMessageReceived(content: String) {
                    Log.d(TAG, "onNewMessageReceived $content")
                    val result = Arguments.createMap()
                    result.putString("content", content);
                    sendEvent(getReactApplicationContext(), "iadvize_onNewMessageReceived", result);
                }

                override fun handleClickedUrl(uri: Uri): Boolean {
                    Log.d(TAG, "handleClickedUrl $uri")
                    val result = Arguments.createMap()
                    result.putString("uri", uri.toString());
                    sendEvent(getReactApplicationContext(), "iadvize_handleClickedUrl", result);
                    return true
                }
            })
        }
    }

    private fun sendEvent(
        reactContext: ReactContext,
        eventName: String,
        @Nullable params: WritableMap
    ) {
        runOnUiThread {
            Log.d(TAG, "sendEvent " + eventName + "called")
            reactContext
                .getJSModule<RCTDeviceEventEmitter>(RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        }
    }

    /*
      Push Notifications
     */
    @ReactMethod
    fun registerPushToken(pushToken: String, mode: String) {
        runOnUiThread {
            Log.d(TAG, "set pushToken " + pushToken)
            IAdvizeSDK.notificationController.registerPushToken(pushToken)
        }
    }

    @ReactMethod
    fun enablePushNotifications(promise: Promise) {
        runOnUiThread {
            IAdvizeSDK.notificationController.enablePushNotifications(object : Callback {
                override fun onSuccess() {
                    promise.resolve(true)
                }

                override fun onFailure(t: Throwable) {
                    promise.reject("1", t.toString())
                }
            })
        }
    }

    @ReactMethod
    fun disablePushNotifications(promise: Promise) {
        runOnUiThread {
            IAdvizeSDK.notificationController.disablePushNotifications(object : Callback {
                override fun onSuccess() {
                    promise.resolve(true)
                }

                override fun onFailure(t: Throwable) {
                    promise.reject("1", t.toString())
                }
            })
        }
    }

    /*
      Chatbox
     */
    @ReactMethod
    fun setDefaultFloatingButton(active: Boolean) {
        runOnUiThread {
            Log.d(TAG, "setDefaultFloatingButton called with " + active.toString())
            if (!active) {
                IAdvizeSDK.defaultFloatingButtonController.setupDefaultFloatingButton(
                    DefaultFloatingButtonOption.Disabled
                )
            } else {
                val configuration = DefaultFloatingButtonConfiguration()
                val option = DefaultFloatingButtonOption.Enabled(configuration)
                IAdvizeSDK.defaultFloatingButtonController.setupDefaultFloatingButton(option)
            }
        }
    }

    @ReactMethod
    fun setFloatingButtonPosition(leftMargin: Int, bottomMargin: Int) {
        runOnUiThread {
            Log.d(TAG, "setFloatingButtonPosition called with " + leftMargin.toString())

            val defaultMargins = DefaultFloatingButtonMargins()
            val margins = DefaultFloatingButtonMargins(
                leftMargin,
                defaultMargins.top,
                defaultMargins.end,
                bottomMargin
            )
            val configuration = DefaultFloatingButtonConfiguration(margins = margins)
            val option = DefaultFloatingButtonOption.Enabled(configuration)
            IAdvizeSDK.defaultFloatingButtonController.setupDefaultFloatingButton(option)
        }
    }

    @ReactMethod
    fun setChatboxConfiguration(data: ReadableMap) {
        runOnUiThread {
            Log.d(TAG, "setChatboxConfiguration " + data)

            val chatboxConfiguration = ChatboxConfiguration(mainColor = Color.WHITE)
            if (data.hasKey("mainColor")) {
                data.getString("mainColor")?.let { value ->
                    (Color.parseColor(value) as? Int)?.let { color ->
                        Log.d(TAG, "set mainColor " + value)
                        chatboxConfiguration.mainColor = color
                    }
                }
            }

            if (data.hasKey("navigationBarBackgroundColor")) {
                data.getString("navigationBarBackgroundColor")?.let { value ->
                    (Color.parseColor(value) as? Int)?.let { color ->
                        Log.d(TAG, "set toolbarBackgroundColor " + value)
                        chatboxConfiguration.toolbarBackgroundColor = color
                    }
                }
            }

            if (data.hasKey("navigationBarMainColor")) {
                data.getString("navigationBarMainColor")?.let { value ->
                    (Color.parseColor(value) as? Int)?.let { color ->
                        Log.d(TAG, "set toolbarMainColor " + value)
                        chatboxConfiguration.toolbarMainColor = color
                    }
                }
            }

            if (data.hasKey("toolbarTitle")) {
                data.getString("toolbarTitle")?.let { value ->
                    Log.d(TAG, "set toolbarTitle " + value)
                    chatboxConfiguration.toolbarTitle = value
                }
            }

            if (data.hasKey("fontPath")) {
                data.getString("fontPath")?.let { value ->
                    Log.d(TAG, "set fontPath " + value)
                    chatboxConfiguration.fontPath = value
                }
            }

            if (data.hasKey("automaticMessage")) {
                data.getString("automaticMessage")?.let { value ->
                    Log.d(TAG, "set automaticMessage " + value)
                    chatboxConfiguration.automaticMessage = value
                }
            }

            if (data.hasKey("gdprMessage")) {
                data.getString("gdprMessage")?.let { value ->
                    Log.d(TAG, "set gdprMessage " + value)
                    chatboxConfiguration.gdprMessage = value
                }
            }

            if (data.hasKey("incomingMessageAvatarURL")) {
                data.getString("incomingMessageAvatarURL")?.let { value ->
                    Log.d(TAG, "set incomingMessageAvatarURL " + value)
                    var url = URL(value)
                    chatboxConfiguration.incomingMessageAvatar = IncomingMessageAvatar.Url(url)
                }
            }

            if (data.hasKey("incomingMessageAvatarImageName")) {
                data.getString("incomingMessageAvatarImageName")?.let { value ->
                    var url = URL(value)
                    chatboxConfiguration.incomingMessageAvatar = IncomingMessageAvatar.Url(url)
                }
            }

            IAdvizeSDK.chatboxController.setupChatbox(chatboxConfiguration)
        }
    }

    @ReactMethod
    fun presentChatbox() {
        val it = getReactApplicationContext().getApplicationContext()
        IAdvizeSDK.chatboxController.presentChatbox(it)
    }

    @ReactMethod
    fun dismissChatbox() {
        IAdvizeSDK.chatboxController.dismissChatbox()
    }

    /*
      Transaction
     */

    @ReactMethod
    fun registerTransaction(data: ReadableMap) {
        runOnUiThread {
            Log.d(TAG, "registerTransaction " + data)

            val transactionId = tryOrNull { data.getString("transactionId") } ?: ""
            val amount = tryOrNull { data.getDouble("amount") } ?: 0.0
            val currencyValue = tryOrNull { data.getString("currency") } ?: ""
            val currency = tryOrNull { Currency.valueOf(currencyValue) } ?: Currency.EUR

            Log.d(TAG, transactionId)
            Log.d(TAG, amount.toString())
            Log.d(TAG, currencyValue)
            Log.d(TAG, currency.toString())
            IAdvizeSDK.transactionController.register(
                Transaction(
                    transactionId,
                    Date(),
                    amount,
                    currency
                )
            )
        }
    }

    /*
      Logout
     */
    @ReactMethod
    fun logout() {
        runOnUiThread {
            Log.d(TAG, "logout called")
            IAdvizeSDK.logout()
        }
    }
}

