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
