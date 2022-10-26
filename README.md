<img src="https://user-images.githubusercontent.com/17723986/47799626-f3982700-dd2a-11e8-983c-77d1a3ed7f53.png" width="280" height="96" alt="iAdvize">

# iAdvize Conversation SDK - React native plugin

Take your app to the next step and provide a unique conversational experience to your users!

Embed the iAdvize Conversation SDK in your app and connect your visitors with your professional operators or ibbü experts through a fully customised chat experience. Visitors can ask a question and will receive answers directly on their devices with push notifications, in or outside your app.

You will find an example of integration in the ` Example/` folder of this repository.

Just run `yarn (or npm) install` and run the project `react-native ios (or android)`.

## Requirements

The iAdvize React native SDK use iAdvize iOS and Android SDK.

For Android requirements :
| Minimum Android Version | Kotlin Version |
| ----------------------- | -------------- |
| API 21                  | 1.6.21         |

For iOS requirements :
| iOS | Xcode |
| ----------------------- | -------------- |
| 12.0 or higher       | 13.X         |

## Documentation

The iOS API reference is available [here](https://iadvize.github.io/iadvize-ios-sdk/).
The Android API reference is available [here](https://iadvize.github.io/iadvize-android-sdk/).

## Setup

### App creation

1. Ask your iAdvize Admin to create a **Mobile App** on the administration website. *If you want to enable the iAdvize SDK push notifications for your user you have to provide your APNS push certificate when you create your app on the administration website.*

2. Ask your iAdvize Admin to create a new **Web & Mobile App** targeting campaign on the administration website and to give you the following information:
    - **projectId**: id of your project
    - **targetingRuleId(s)**: one or multiple rules which you will be able to activate in code during the user navigation (see [Targeting](#Targeting)).

## Installation

### Get the SDK
First, download the library from `npm`:
```ruby
npm install iadvize-react-native-sdk
```
You can also use `yarn`:
```ruby
yarn add iadvize-react-native-sdk
```

### For iOS
For iOS app make sure to go to `ios` folder and install Cocoapods dependencies:
```ruby
cd ios && pod install
```

The SDK is distributed as an XCFramework, therefore **you are required to use CocoaPods 1.9.0 or newer**.

Add the following to the bottom of your Podfile:

```ruby
post_install do |installer|
    installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
            config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
        end
    end
end
```

> This post_install hook is required because the iAdvize SDK supports [module stability](https://swift.org/blog/abi-stability-and-more/). Therefore, all its dependencies must be built using the "Build Libraries for Distribution" option.

### For Android
#### Dependencies

Link your project with the iAdvize Conversation SDK dependency, add this line to your app's `build.gradle`:

```gradle
// Module-level build.gradle

configurations {
  all*.exclude group: 'xpp3', module: 'xpp3'
  debug
  release
}

dependencies {
  // If you use AndroidX you can use latest SDK
  implementation 'com.iadvize:iadvize-sdk:2.8.0'
}
```

#### initiate

First of all, you have to initiate the iAdvize SDK by providing a reference to your current Android application:

```kotlin
class App : Application() {
  override fun onCreate() {
    super.onCreate()
    IAdvizeSDK.initiate(this)
  }
}
```

## Usage

### Import

You need to import the SDK.

```js
import Iadvize from '@iadvize-oss/iadvize-react-native-sdk';
```

### Activation

To activate the SDK you must use the **activate** function. You also have access to a asynchronous callback in order to know if the SDK has been successfully activated (and to retry later if the activation fails):

```js
try {
  await Iadvize.activate(projectId, 'userId', 'legalInfoUrl' OR null);
  console.log('iAdvize SDK activated');
} catch (e) {
  console.log('iAdvize SDK not activated');
  console.error(e);
}
```

Once the iAdvize Conversation SDK is successfully activated, you should see a success message in the console:

```
✅ iAdvize conversation activated, the version is x.x.x.
```

Do not forget to [logout](#Logout) when the user is no longer connected in your app.

##### GDPR

By default, when you activate the SDK, the GDPR will be disabled.

To enable it, you can pass a GDPR option while activating the SDK. This GDPROption dictates how the SDK behaves when the user taps on the “More information” button:

1. `gdprURL`: will open the given URL containing GDPR information

The GDPR process is now activated for your users and a default message will be provided to collect the user consent. Please check the [Customization](#Customization) section below if you want to customise this message.

You can empty value in the `gdprURL` parameter to disable GDPR.

#### Logging

By default, the SDK will **only log Warnings and Errors**. You can make it more verbose and choose between multiple levels of log for a better integration experience:

```js
Iadvize.setLogLevel(LogLevel.VERBOSE);
```

Possible values are :
```js
export enum LogLevel {
  VERBOSE = 0,
  INFO,
  WARNING,
  ERROR,
  SUCCESS,
}
```

### Targeting

#### Targeting Language

By default, the SDK will use the device language for **targeting a conversation**. With this variable you can specify the language you want to use for targetting:

```js
Iadvize.setLanguage('fr');
```
The parameter passed to the function is a `string` parameter.
> :warning: This `language` property is NOT intended to change the language displayed in the SDK.

#### Activate a targeting rule

For the iAdvize SDK to work, you have to setup an active targeting rule. To do so, you can call the following method:

```js
Iadvize.activateTargetingRule("YOUR_TARGETING_RULE_UUID", ConversationChannel.CHAT);
// OR
Iadvize.activateTargetingRule("YOUR_TARGETING_RULE_UUID", ConversationChannel.VIDEO);
```

#### Targeting rule availability

The targeting rule availability check will be triggered when you update the active targeting rule (see [Activate a targeting rule](#rule))

You can check the active rule availability by accessing:

```js
Iadvize.isActiveTargetingRuleAvailable()
```

Or if you want to be informed of rule availability updates, you can add a delegate:

```js
IadvizeListeners.onActiveTargetingRuleAvailabilityUpdated?.(function (
      data: any
    ) {
      console.log(data);
    });
```

#### Follow user navigation

To allow iAdvize statistics to be processed you need to inform the SDK when the user navigates through the screens your app, you will have to call `registerUserNavigation` and pass a navigation option which allows you to clear, keep or activate a new targeting rule.

```js
Iadvize.registerUserNavigation(NavigationOption.clear, "", "");
// OR
Iadvize.registerUserNavigation(NavigationOption.keep, "", ConversationChannel.CHAT);
// OR
Iadvize.registerUserNavigation(NavigationOption.new, "YOUR_TARGETING_RULE_UUID", ConversationChannel.CHAT/ConversationChannel.VIDEO);
```

### Conversation

#### Ongoing conversation

To know and to observe the evolution of the conversation state, you will have access to a variable:

```js
Iadvize.ongoingConversationId()
```

you will be able to figure out the channel of the current conversation by calling:

```js
Iadvize.ongoingConversationChannel()
```

You can also add a delegate to be informed in real time about conversation events:

```js
IadvizeListeners.onOngoingConversationStatusChanged?.(function (data: any) {
  console.log(data);
});

IadvizeListeners.onNewMessageReceived?.(function (data: any) {
  console.log(data);
});

IadvizeListeners.handleClickedUrl?.(function (data: any) {
  console.log(data);
});
```

### Push notifications

#### Configuration

To receive push notification when a message is sent to the visitor, you must register the current **push token** of the device:

```js
Iadvize.registerPushToken('the_device_push_token', ApplicationMode.DEV);
```

Possible values of `ApplicationMode` are (useful for iOS only) :
```js
export enum ApplicationMode {
  DEV = 'dev',
  PROD = 'prod',
}
```

You can register your push token at any time.

By default, push notifications are activated if you have setup the push notifications information for your app on the iAdvize administration website. You can manually enable/disable them at any time using:

```js
try {
  await Iadvize.enablePushNotifications();
} catch (e) {
  console.error(e);
}

try {
  await Iadvize.disablePushNotifications();
} catch (e) {
  console.error(e);
}
```

### Chatbox

The Chatbox is where the conversation takes place. The visitor can open the Chatbox by touching the Chat button.

You can control the appearance and behavior of the Chatbox and Chat button.

#### Chat button

When the active targeting rule is available, a chat button is displayed to invite the user to chat.

You can decide to let the SDK manage the chat button visibility or control it yourself using the following flag:

```js
Iadvize.setDefaultFloatingButton(boolean);
```

##### Default chat button
If `setDefaultFloatingButton == true` the SDK will use the iAdvize default chat button, manage its visibility, and open the chatbox when user presses it.

The default chat button is anchored to the bottom-left of your screen, you can change its position using:

```js
Iadvize.setFloatingButtonPosition(leftMargin, bottomMargin);
```

#### Customization

You can customize the chatbox UI by calling the following method:

```js
const configuration: ChatboxConfiguration = {};
Iadvize.setChatboxConfiguration(configuration);
```

A simple snippet to only change one value:

```js
const configuration: ChatboxConfiguration = {
  mainColor: '#000000',
};
Iadvize.setChatboxConfiguration(configuration);
```

The `ChatboxConfiguration` allow you to customize the following attributes:

##### Main color

You can setup a main color on the SDK which will be applied to the color of:

- the default Chat button (if you use it)
- the send button in the Conversation View
- the blinking text cursor in the “new message” input in the Conversation View
- the background color of the message bubbles (only for sent messages)

```js
const configuration: ChatboxConfiguration = {
  mainColor: '#000000',
};
```

Where the value is an hexadecimal color.

##### Navigation bar

You can configure the Toolbar of the Chatbox and modify:

- the background color
- the main color
- the title

```js
const configuration: ChatboxConfiguration = {
  navigationBarBackgroundColor: '#000000',
  navigationBarMainColor: '#000000',
  navigationBarTitle: 'Conversation',
};
```
Where the value is an hexadecimal color.

##### Font

You can update the font used in the UI of the IAdvize Conversation SDK. You just have to call this method to setup your own font:

```js
const configuration: ChatboxConfiguration = {
  fontName: 'AmericanTypewriter-Condensed', // iOS only
  fontSize: 11, // iOS only
  fontPath: 'fonts/ProximaNova-Regular.otf', // Android only
};
```

##### Automatic message

A first automatic message can be setup to be displayed as an operator message in the Chatbox. By default, no message will be displayed. This message will also be used and displayed when the user accepts the GDPR. You can set an automatic message through:

```js
const configuration: ChatboxConfiguration = {
  automaticMessage: 'Hello! Please ask your question :)',
};
```

##### GDPR message

If you want to activate the GDPR consent collect feature through the iAdvize Conversation SDK.

Once the GDPR is activated, you can easily customise the GDPR message you want to display to your users to collect their consent:

```js
const configuration: ChatboxConfiguration = {
  gdprMessage: 'Your own GDPR message.',
};
```

##### Brand avatar

You can update the brand avatar displayed for the incoming messages. You can specify an URL or a Drawable. Gifs are not supported.

```js
// Update the incoming message avatar with an image name.
const configuration: ChatboxConfiguration = {
  incomingMessageAvatarImageName: 'imageName',
};

// Update the incoming message avatar with an `url` string.
const configuration: ChatboxConfiguration = {
  incomingMessageAvatarURL: 'url',
};
```

### Transaction

You can register a transaction within your application:

```js
const transaction: Transaction = {
  transactionId: 'transactionId',
  currency: 'EUR',
  amount: 100,
};
Iadvize.registerTransaction(transaction);
```

The currency value need to be uppercased.

### Logout

When the user is logged out in your app, you need to log out in the iAdvize SDK as well to ensure the privacy of the user data and conversations.

```js
Iadvize.logout()
```

This will clear all the locally stored visitor data.

## And you’re done! 💪

Well done! You’re now ready to take your app to the next step and provide a unique conversational experience to your users! 🚀
