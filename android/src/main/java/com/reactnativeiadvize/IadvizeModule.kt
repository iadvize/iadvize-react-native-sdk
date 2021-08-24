package com.reactnativeiadvize

import android.graphics.Color
import android.graphics.drawable.Drawable
import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.iadvize.conversation.sdk.IAdvizeSDK
import com.iadvize.conversation.sdk.controller.conversation.ConversationListener
import com.iadvize.conversation.sdk.controller.targeting.TargetingListener
import com.iadvize.conversation.sdk.model.IAdvizeSDKCallback
import com.iadvize.conversation.sdk.model.auth.AuthenticationOption
import com.iadvize.conversation.sdk.model.configuration.ChatboxConfiguration
import com.iadvize.conversation.sdk.model.conversation.IncomingMessageAvatar
import com.iadvize.conversation.sdk.model.gdpr.GDPREnabledOption
import com.iadvize.conversation.sdk.model.gdpr.GDPROption
import com.iadvize.conversation.sdk.model.language.SDKLanguageOption
import com.iadvize.conversation.sdk.model.transaction.Transaction
import com.iadvize.conversation.sdk.type.Language
import com.iadvize.conversation.sdk.utils.logger.Logger
import com.iadvize.conversation.sdk.type.Currency
import java.net.URI
import java.net.URL
import java.util.*
import javax.annotation.Nullable


class IadvizeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "Iadvize"
    }

    /*
      Activation
     */

    @ReactMethod
    fun activate(projectId: Int, userId: String, legalInfoUrl: String, promise: Promise) {
      Log.d("iAdvize SDK activate", "called")

      var legalUrl = URI(legalInfoUrl)
      val gdprOption = if (legalUrl != null) GDPROption.Enabled(GDPREnabledOption.LegalUrl(legalUrl)) else GDPROption.Disabled()

      IAdvizeSDK.activate(
        projectId,
        AuthenticationOption.Simple(userId),
        gdprOption,
        object : IAdvizeSDKCallback {
          override fun onSuccess() {
            Log.d("iAdvize SDK onSuccess", "onSuccess")
            promise.resolve(true)
          }

          override fun onFailure(t: Throwable) {
            Log.d("iAdvize SDK onFailure", t.toString())
            promise.reject("1", t.toString())
          }
        }
      )
    }

    /*
      Logging
     */

    @ReactMethod
    fun setLogLevel(logLevel: Int) {
      Log.d("iAdvize SDK setLogLevel", logLevel.toString())
      IAdvizeSDK.logLevel = logLevelFrom(logLevel)
    }

    fun logLevelFrom(value: Int) : Logger.Level{
      when (value) {
        0 -> return Logger.Level.VERBOSE
        1 -> return Logger.Level.INFO
        2 -> return Logger.Level.WARNING
        3 -> return Logger.Level.ERROR
        4 -> return Logger.Level.SUCCESS
        else -> return Logger.Level.VERBOSE
      }
    }

    /*
      Targeting
     */

    @ReactMethod
    fun setLanguage(language: String) {
      Log.d("iAdvize SDK setLanguage", language)
      var language = Language.safeValueOf(language);
      IAdvizeSDK.targetingController.language = SDKLanguageOption.Custom(language)
    }

    @ReactMethod
    fun activateTargetingRule(uuid: String) {
      var value = UUID.fromString(uuid)
      Log.d("iAdvize SDK set uuid", value.toString())
      IAdvizeSDK.targetingController.activateTargetingRule(value)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun isActiveTargetingRuleAvailable() {
      Log.d("iAdvize SDK", "isActiveTargetingRuleAvailable exist only on Android")
    }

    @ReactMethod
    fun setOnActiveTargetingRuleAvailabilityListener() {
      Log.d("iAdvize SDK", "setOnActiveTargetingRuleAvailabilityListener called")

      IAdvizeSDK.targetingController.listeners.add(object : TargetingListener {
        override fun onActiveTargetingRuleAvailabilityUpdated(isActiveTargetingRuleAvailable: Boolean) {
          val result = Arguments.createMap()
          result.putBoolean("isActiveTargetingRuleAvailable", isActiveTargetingRuleAvailable);
          sendEvent(getReactApplicationContext(), "iadvize_activeTargetingRuleAvailabilityUpdated", result);
        }
      })
    }

    @ReactMethod
    fun registerUserNavigation() {
      Log.d("iAdvize SDK", "registerUserNavigation called")
      IAdvizeSDK.targetingController.registerUserNavigation()
    }

    /*
    Conversation
     */

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hasOngoingConversation(): Boolean {
      Log.d("iAdvize SDK", "hasOngoingConversation called")
      return IAdvizeSDK.conversationController.hasOngoingConversation()
    }

    @ReactMethod
    fun setConversationListener() {
      Log.d("iAdvize SDK", "setConversationListener called")

      IAdvizeSDK.conversationController.listeners.add(object : ConversationListener {
        override fun onOngoingConversationStatusChanged(hasOngoingConversation: Boolean) {
          val result = Arguments.createMap()
          result.putBoolean("hasOngoingConversation", hasOngoingConversation);
          sendEvent(getReactApplicationContext(), "iadvize_onOngoingConversationStatusChanged", result);
        }

        override fun onNewMessageReceived(content: String) {
          val result = Arguments.createMap()
          result.putString("content", content);
          sendEvent(getReactApplicationContext(), "iadvize_onNewMessageReceived", result);
        }

        override fun handleClickedUrl(uri: Uri): Boolean {
          val result = Arguments.createMap()
          result.putString("uri", uri.toString());
          sendEvent(getReactApplicationContext(), "iadvize_handleClickedUrl", result);
          return true
        }
      })
    }

    private fun sendEvent(reactContext: ReactContext, eventName: String, @Nullable params: WritableMap) {
      Log.d("iAdvize SDK", "sendEvent "+eventName+"called")
      reactContext
        .getJSModule<RCTDeviceEventEmitter>(RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
    }

    /*
      Push Notifications
     */

    @ReactMethod
    fun registerPushToken(pushToken: String, mode: String) {
      Log.d("iAdvize SDK", "set pushToken " + pushToken)
      IAdvizeSDK.notificationController.registerPushToken(pushToken)
    }

    @ReactMethod
    fun enablePushNotifications(promise: Promise) {
      IAdvizeSDK.notificationController.enablePushNotifications(object : IAdvizeSDKCallback {
        override fun onSuccess() {
          promise.resolve(true)
        }

        override fun onFailure(t: Throwable) {
          promise.reject("1", t.toString())
        }
      })
    }

    @ReactMethod
    fun disablePushNotifications(promise: Promise) {
      IAdvizeSDK.notificationController.disablePushNotifications(object : IAdvizeSDKCallback {
        override fun onSuccess() {
          promise.resolve(true)
        }

        override fun onFailure(t: Throwable) {
          promise.reject("1", t.toString())
        }
      })
    }

    /*
      Chatbox
     */

    @ReactMethod
    fun setDefaultChatButton(active: Boolean) {
      Log.d("iAdvize SDK", "setDefaultChatButton called with " + active.toString())
      IAdvizeSDK.chatboxController.useDefaultChatButton = true
    }

    @ReactMethod
    fun setChatButtonPosition(leftMargin: Int, bottomMargin: Int) {
      Log.d("iAdvize SDK", "setChatButtonPosition called with " + leftMargin.toString())
      IAdvizeSDK.chatboxController.setChatButtonPosition(leftMargin, bottomMargin)
    }

    @ReactMethod
    fun setChatboxConfiguration(data: ReadableMap) {
      Log.d("iAdvize SDK", "setChatboxConfiguration " + data)

      var chatboxConfiguration = ChatboxConfiguration(mainColor = Color.WHITE)
      if (data.hasKey("mainColor")){
        data.getString("mainColor")?.let { value ->
          (Color.parseColor(value) as? Int)?.let{ color ->
            Log.d("iAdvize SDK", "set mainColor " + value)
            chatboxConfiguration.mainColor = color
          }
        }
      }

      if (data.hasKey("navigationBarBackgroundColor")){
        data.getString("navigationBarBackgroundColor")?.let { value ->
          (Color.parseColor(value) as? Int)?.let{ color ->
            Log.d("iAdvize SDK", "set toolbarBackgroundColor " + value)
            chatboxConfiguration.toolbarBackgroundColor = color
          }
        }
      }

      if (data.hasKey("navigationBarMainColor")){
        data.getString("navigationBarMainColor")?.let { value ->
          (Color.parseColor(value) as? Int)?.let{ color ->
            Log.d("iAdvize SDK", "set toolbarMainColor " + value)
            chatboxConfiguration.toolbarMainColor = color
          }
        }
      }

      if (data.hasKey("toolbarTitle")){
        data.getString("toolbarTitle")?.let { value ->
          Log.d("iAdvize SDK", "set toolbarTitle " + value)
          chatboxConfiguration.toolbarTitle = value
        }
      }

      if (data.hasKey("fontPath")){
        data.getString("fontPath")?.let { value ->
          Log.d("iAdvize SDK", "set fontPath " + value)
          chatboxConfiguration.fontPath = value
        }
      }

      if (data.hasKey("automaticMessage")){
        data.getString("automaticMessage")?.let { value ->
          Log.d("iAdvize SDK", "set automaticMessage " + value)
          chatboxConfiguration.automaticMessage = value
        }
      }

      if (data.hasKey("gdprMessage")){
        data.getString("gdprMessage")?.let { value ->
          Log.d("iAdvize SDK", "set gdprMessage " + value)
          chatboxConfiguration.gdprMessage = value
        }
      }

      if (data.hasKey("incomingMessageAvatarImageName")){
        data.getString("incomingMessageAvatarImageName")?.let { value ->
          Drawable.createFromPath(value)?.let { drawable ->
            Log.d("iAdvize SDK", "set incomingMessageAvatarImageName " + value)
            chatboxConfiguration.incomingMessageAvatar = IncomingMessageAvatar.Image(drawable)
          }
        }
      }

      if (data.hasKey("incomingMessageAvatarURL")){
        data.getString("incomingMessageAvatarURL")?.let { value ->
          Log.d("iAdvize SDK", "set incomingMessageAvatarURL " + value)
          var url = URL(value)
          chatboxConfiguration.incomingMessageAvatar = IncomingMessageAvatar.Url(url)
        }
      }

      IAdvizeSDK.chatboxController.setupChatbox(chatboxConfiguration)
    }

    /*
      Transaction
     */

    @ReactMethod
    fun registerTransaction(data: ReadableMap) {
      Log.d("iAdvize SDK", "registerTransaction " + data)

      val transactionId = data.getString("transactionId") ?: ""
      val amount = data.getDouble("amount") ?: 0.0
      val currencyValue = data.getString("currency") ?: ""
      val currency = Currency.safeValueOf(currencyValue) ?: Currency.EUR

      Log.d("iAdvize SDK", transactionId)
      Log.d("iAdvize SDK", amount.toString())
      Log.d("iAdvize SDK", currencyValue)
      Log.d("iAdvize SDK", currency.toString())
      IAdvizeSDK.transactionController.register(
        Transaction(
          transactionId,
          Date(),
          amount,
          currency
        )
      )
    }

    /*
      Logout
     */

    @ReactMethod
    fun logout() {
      Log.d("iAdvize SDK", "logout called")
      IAdvizeSDK.logout()
    }
}
