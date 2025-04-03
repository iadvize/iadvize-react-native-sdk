## 4.3.1 > 4.3.2

*Nothing to report*

## 4.3.0 > 4.3.1

*Nothing to report*

## 4.2.6 > 4.3.0

**Smaller Chatbox**

The Chatbox can now be presented in a compact mode, the visitor can resize the chatbox manually by dragging the toolbar.
The chatbox is automatically expanded when the keyboard opens. This compact mode can be enabled by using a flag in the `ChatboxConfiguration`:

```
const configuration: ChatboxConfiguration = {
  ...

  isSmallerChatboxEnabled: true,

  ...
};
IAdvizeSDK.setChatboxConfiguration(configuration);
```

## 4.2.5 > 4.2.6

*Nothing to report*

## 4.2.4 > 4.2.5

*Nothing to report*

## 4.2.3 > 4.2.4

**Automatic Push Notifications Handling**

Push notifications are now **automatically enabled** every time a visitor is activated using IAdvizeSDK.activate(projectId:authenticationOption:gdprOption:completion:).

  - Previously, push notifications were only enabled during the first activation. After logout, they were disabled, requiring manual re-enablement on subsequent activations.

  - Now, push notifications will automatically re-enable during every activation, regardless of whether it’s the visitor’s first or a subsequent activation.

You only need to call IAdvizeSDK.enablePushNotifications if you previously disabled them using IAdvizeSDK.disablePushNotifications.

## 4.2.2 > 4.2.3

*Nothing to report*

## 4.2.1 > 4.2.2

This versions updates several build system dependencies:

- React Native 0.75.4
- React 18.3.1
- Android SDK 35
- Kotlin 2.0
- Gradle 8.10
- Android Gradle Plugin 8.6
- iOS 18
- Xcode 16

Please note that the minimum OS requirements have evolved with this version:
- minimum Android supported version is now Android 7 (SDK 24)
- minimum iOS supported version is now 13.4

## 4.2.0 > 4.2.1

*Nothing to report*

## 4.1.5 > 4.2.0

### Debug Info

This releases adds a new `debugInfo` API that returns the status of the SDK at any given moment. This API could be used for debugging purposes, you can add the JSON string output to your log reporting tool.

```
const debugInfo = IAdvizeSDK.debugInfo();
```

```
{
  "targeting": {
    "screenId": "67BA3181-EBE2-4F05-B4F3-ECB07A62FA92",
    "activeTargetingRule": {
      "id": "D8821AD6-E0A2-4CB9-BF45-B2D8A3CF4F8D",
      "conversationChannel": "chat"
    },
    "isActiveTargetingRuleAvailable": false,
    "currentLanguage": "en"
  },
  "device": {
    "model": "iPhone",
    "osVersion": "17.5",
    "os": "iOS"
  },
  "ongoingConversation": {
    "conversationChannel": "chat",
    "conversationId": "02012815-4BDA-42EF-87DC-5C6ED317AF7F"
  },
  "chatbox": {
    "useDefaultFloatingButton": true,
    "isChatboxPresented": false
  },
  "activation": {
    "activationStatus": "activated",
    "authenticationMode": "simple",
    "projectId": "7260"
  },
  "connectivity": {
    "wifi": true,
    "isReachable": true,
    "cellular": false
  },
  "visitor": {
    "vuid": "d4a57969c7fc4e2a9380f3931fdcee3a965650eb9c6b4",
    "tokenExpiration": "2025-02-27T08:14:11Z"
  },
  "sdkVersion": "2.15.4"
}
```

### Targeting Listener failure callback

This release also adds a callback to notify the integrator about targeting rule trigger failures. This takes the form of a new callback inside the `IAdvizeSDKListeners`: 

```
IAdvizeSDKListeners.onActiveTargetingRuleAvailabilityUpdateFailed(function (eventData: any) {
  console.log('onActiveTargetingRuleAvailabilityUpdateFailed', eventData.code, "=>", eventData.message);
});
```

This will be called when triggering the targeting rule fails and give the reason of the failure when possible.
Please note that the targeting rule triggering may fail, but for standard reasons (for instance if there is no agent availabale to answer). In those cases this `onActiveTargetingRuleAvailabilityUpdateFailed` callback would not be called, only the usual `onActiveTargetingRuleAvailabilityUpdated` would be called with a `false` value for `eventData.isActiveTargetingRuleAvailable`.

> To integrate this update you will have to update your code where you want to use the `IAdvizeSDKListeners` to add this new callback.

### Error encapsulation

The iAdvize Android SDK errors are now all part of a generic `IAdvizeSDK.Error` object. This is now the type that is used in the `IAdvizeSDK.Callback` failure method (that is used as an asynchronous return for multiple APIs).

Event though this is transparent in a React Native implementation, this impacts the use of the `initiate` method that you have to call in your Android `Application` class as the callback failure signature has changed.

```
@Override
public void onCreate() {
  super.onCreate();
  SoLoader.init(this, /* native exopackage */ false);

  IAdvizeSDK.initiate(this, new IAdvizeSDK.Callback() {
    @Override
    public void onSuccess() {
        Log.v("MainApplication", "IAdvizeSDK successfully initialized");
    }

    @Override
    public void onFailure(@NonNull IAdvizeSDK.Error error) {
        Log.e("MainApplication", "Error while initializing IAdvizeSDK");
    }
  });
}
```

> To integrate this update you will have to update your main Android application class where you use the native Android `initiate` method.

## 4.1.4 > 4.1.5

*Nothing to report*

## 4.1.3 > 4.1.4

*Nothing to report*

## 4.1.2 > 4.1.3

This release adds a new LogLevel.ALL to force the logging of all possible logs of the SDK. This must be used with caution as latencies may be noticed in the hosting app, so do not use this feature without iAdvize explicit authorization for live debugging.

## 4.1.0 > 4.1.2

*Nothing to report*

## 4.0.3 > 4.1.0

*Nothing to report*

## 4.0.2 > 4.0.3

*Nothing to report*

## 4.0.1 > 4.0.2

This release adds a missing callback to the `logout` API. It now returns a `Promise<boolean>`:

```
try {
  await IAdvizeSDK.logout();
  console.log('Successfully logged out of iAdvize SDK');
} catch (e) {
  console.log('Error while logging out of iAdvize SDK');
  console.error(e);
}
```

## 4.0.0 > 4.0.1

*Nothing to report*

## 3.4.7 > 4.0.0

In previous versions the Secured Auth callback was synchronous (waiting for a direct return). This was not intended.
This version fixes it by making the flow asynchronous. Here is the updated flow:

```
// To activate Secured Auth, first set the onJWERequested listener
IAdvizeSDKListeners.onJWERequested(function (eventData: any) {
  console.log('onJWERequested' + ' ' + eventData);

  // TODO Fetch JWE from your 3rd-party auth system
});
// Activate the SDK as usual
await IAdvizeSDK.activate(projectId, '', ...);



// When the JWE is fetched, you must call this API to proceed:
IAdvizeSDK.provideJWE(jwe);
```

## 3.4.6 > 3.4.7

*Nothing to report*

## 3.4.5 > 3.4.6

*Nothing to report*

## 3.4.4 > 3.4.5

The `initiate` API now has a IAdvizeSDK.Callback as an optional argument to inform the host app if it fails.
The Android SDK is developped in Kotlin, but the ReactNative wrappers are developped in Java, that means that this optional argument,
although not necessary in Kotlin, has to be set in Java.
Thus  it is needed to specify this argument when calling the initaite method:
```
IAdvizeSDK.initiate(this, new IAdvizeSDK.Callback() {
    @Override
    public void onSuccess() {
        Log.v("MainApplication", "IAdvizeSDK successfully initialized");
    }

    @Override
    public void onFailure(@NonNull Throwable throwable) {
        Log.e("MainApplication", "Error while initializing IAdvizeSDK");
    }
});
```

Please note that before calling the callback failure method, the API will first retry once, so if the callback failure is called it 
means the API has failed twice to initiate the SDK.

## 3.4.3 > 3.4.4

In this release the Push Notification APIs has been enhanced so that you can now clear the iAdvize Push Notifications on demand.

In order to do so on Android, the SDK now provides a specific Notification Channel, where all iAdvize push notifications may be placed. That way, the SDK will automatically clear this notification channel when Chatbox is opened, and you can clear it manually by calling one of the SDK APIs.

First of all you need to create this notification channel:

```
IAdvizeSDK.createNotificationChannel();
```
This call does nothing when called on an iOS platform.

Then, when receiving a push notification, in order to display it via your usual notification library, you need to specify the notificaiton channel id retrieved via:
```
IAdvizeSDK.notificationChannelId();
```
Here as well this API does nothing on iOS (it returns an empty string).

In order to know how to specify the notification channel id when displaying the push notification, please refer to the documentation of your notification library.

On iOS the notification channel concept does not exist so nothing has to be done here for configuration.

Once this is done, the push notification coming from iAdvize will be cleared automatically when the visitor opens the Chatbox. 
If you want to clear them manually at any other time you can call this API:

```
IAdvizeSDK.clearIAdvizePushNotifications()
```

## 3.4.2 > 3.4.3

APIs were added in order for the integrator to unset the GDPR or secured auth listeners:

```
IAdvizeSDKListeners.unsetJWEProvider();
IAdvizeSDKListeners.unsetGDPRMoreInfoClickedListener();
```

## 3.4.0 > 3.4.2

*Nothing to report*

## 3.3.0 > 3.4.0

Chatbox APIs were added in order for the integrator to know when the Chatbox is opened & closed.

```
IAdvizeSDKListeners.onChatboxOpened(function (eventData: any) {
  console.log('onChatboxOpened', eventData);
});

IAdvizeSDKListeners.onChatboxClosed(function (eventData: any) {
  console.log('onChatboxClosed', eventData);
});
```

## 3.2.3 > 3.3.0

This release deprecates the ChatboxConfiguration.mainColor setting and adds new ways to customize the look and feel of the messages, both the ones from the visitor and the ones from the agent. Please review the new parameters to customize them to your liking.

This release adds a new LogLevel.NONE to disable all console logs and all logging capture. Please note that this disables iAdvize functional logs aggregation as well so debugging issues will be made harder if this mode is chosen.


## 3.2.2 > 3.2.3

The addition of the missing header in the iOS bridge should allow you to use the ReactNative SDK plugin as a static library, thus allowing you to remove the `use_frameworks!` directive from your iOS `Podfile`.

## 3.2.1 > 3.2.2

*Nothing to report*

## 3.2.0 > 3.2.1

*Nothing to report*

## 3.1.1 > 3.2.0

From this release and onward, the possibility to upload files in the conversation is based on the option
available in the Admin Chatbox Builder. To enable/disable it go to your iAdvize Administration Panel then :
> Engagement > Notifications & Chatbox > Chatbox (Customize) > Composition box (tab) > Allow the visitor to upload images and pdf

## 3.1.0 > 3.1.1

*Nothing to report*

## 3.0.3 > 3.1.0

*Nothing to report*

## 3.0.1 > 3.0.3

Before version 3.0.3 it was necessary to add a line in the ios app `Podfile` to locate the iAdvize SDK podspec: 

```
pod 'iadvize-reactnative-sdk', :path => '../node_modules/@iadvize-oss/iadvize-react-native-sdk/ios/'
```

This was because our podspec file was not located on the right repository. It is fixed now in the 3.0.3 release so this line is no longer needed as ReactNative can find it automatically, and you will have to remove it in order for the `pod install` command to work.


## 3.0.0 > 3.0.1

The Kotlin version used in the SDK was updated from `1.7.20` to `1.8.10`. You will need to update your
Kotlin version accordingly in order for your project to compile.

## 2.8.2 > 3.0.0

> *⚠️ This release brings breaking API changes.*`

#### API renaming
The API has been renamed for clarity, you will have to refactor your SDK calls accordingly:
- Iadvize => IAdvizeSDK
- IadvizeListeners => IAdvizeSDKListeners

#### GDPROption Listener

You can configure how the SDK behaves when the user taps on the `More information` button by either:

- providing an URL pointing to your GPDR policy, it will be opened on user click
- providing a listener/delegate, it will be called on user click and you can then implement your own custom behavior

> *⚠️ If your visitors have already consented to GDPR inside your application, you can activate the iAdvize SDK without the GDPR process. However, be careful to explicitly mention the iAdvize Chat part in your GDPR consent details.*

<pre class="prettyprint">
// No listener set + null URL => GDPR is disabled
await IAdvizeSDK.activate(projectId, userId, null);

// No listener set + non-null URL => GDPR is enabled, the webpage opens when user click on more info button
await IAdvizeSDK.activate(projectId, userId, "http://my.gdpr.rules.com");

// Listener set => GDPR is enabled, the listener is called when user click on more info button
IAdvizeSDKListeners.onGDPRMoreInfoClicked(function (eventData: any) {
  // Implement your own behavior
});
await IAdvizeSDK.activate(projectId, userId, null);
</pre>

> *⚠️ If you set both the listener and an URL, the listener will take the priority.*


#### Add the Secured AuthenticationOption for secured authentication process

You can choose between multiple authentication options:

- **Anonymous**, when you have an unidentified user browsing your app
- **Simple**, when you have a logged in user in your app. You must pass a unique string identifier so that the visitor will retrieve his conversation history across multiple devices and platforms
- **Secured**: use it in conjunction with your in-house authentication system. You must pass a *JWE provider* callback that will be called when an authentication is required, you will then have to call your third party authentication system for a valid JWE to provide to the SDK

<pre class="prettyprint">
// Anonymous Auth => Do not set the onJWERequested listener & set an empty userId
await IAdvizeSDK.activate(projectId, '', ...);

// Simple Auth => Do not set the onJWERequested listener & set a non-empty userId
await IAdvizeSDK.activate(projectId, "my-user-unique-id", ...);

// Secured Auth => Set the onJWERequested listener
IAdvizeSDKListeners.onJWERequested(function (eventData: any) {
  console.log('onJWERequested' + ' ' + eventData);
  var jwe = ... ;// Fetch JWE from your 3rd-party auth system
  return jwe;
});
await IAdvizeSDK.activate(projectId, '', ...);
</pre>

> *⚠️ If you set both the listener and an user id, the listener will take the priority.*

> *⚠️ For the __Simple__ authentication mode, the identifier that you pass must be __unique and non-discoverable for each different logged-in user__.*

> *⚠️ For a full understanding of how the secured authentication works in the iAdvize platform you can refer to this [Knowledge Base article](https://help.iadvize.com/hc/fr/articles/6043078724626-Messagerie-authentifi%C3%A9e-iAdvize-impl%C3%A9mentation-c%C3%B4t%C3%A9-client-web).*

#### Add Chatbox API (presentChatbox / dismissChatbox / isChatboxPresented)

You can open/close the Chatbox by calling the following methods:

<pre class="prettyprint">
IAdvizeSDK.presentChatbox()
IAdvizeSDK.dismissChatbox()
</pre>

> *⚠️ Please note that opening the Chatbox when the user is not targeted via the engagement process is not a good practice and may lead to a degraded conversation experience.*

#### Add notification API (isIAdvizePushNotification)

As the SDK notifications are caught in the same place than your app other notifications, you first have to distinguish if the received notification comes from iAdvize or not. This can be done using:

<pre class="prettyprint">
function handleNotification(remoteMessage: any) {
  console.log('handling notification', JSON.stringify(remoteMessage));
  var isIAdvizeSDKNotification = IAdvizeSDK.isIAdvizePushNotification(remoteMessage.data)
}
</pre>

#### Add Custom Data API (registerCustomData) to save visitor custom data

The iAdvize Messenger SDK allows you to save data related to the visitor conversation:

<pre class="prettyprint">
var customData = {
  "Test": "Test",
  "Test2": false,
  "Test3": 2.5,
  "Test4": 3
};
IAdvizeSDK.registerCustomData(customData);
</pre>

> *⚠️ As those data are related to the conversation they cannot be sent if there is no ongoing conversation. Custom data registered before the start of a conversation are stored and the SDK automatically tries to send them when the conversation starts.*

The visitor data you registered are displayed in the iAdvize Operator Desk in the conversation sidebar, in a tab labelled  `Custom data`:

### Integration documentation

Please refer to our up-to-date public integration documentation if needed, it contains code snippets
for each feature of the SDK:
https://developers.iadvize.com/documentation/mobile-sdk
