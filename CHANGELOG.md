# 4.4.3 (Gaperon)

### Release date 2025/09/18

**Dependencies**

- (Android) Fix iAdvize Mobile SDK repository URL

# 4.4.2 (Gaperon)

### Release date 2025/09/12

**Features**

- Accessibility
  - Improved message grouping and accessibility labels.
  - Added missing accessibility labels and adjust contrast on buttons.
  - Fixed Dynamic Type text-scaling issues.
  - VoiceOver/TalkBack now announces incoming messages.

**Bug fixes**

- (iOS) Fix crash caused by concurrent access on visitor custom data.
- (Android) Fix chatbox edge-to-edge display on pre-Android 15 devices

**Dependencies**

- React Native `0.80.1` > `0.81.4`
- Gradle `8.14` > `8.14.3`
- Android SDK `35.0.0` > `36.0.0`
- Android Gradle Plugin `8.10.1` > `8.12.2`
- Kotlin `2.1.20` > `2.2.10`

# 4.4.1 (Gaperon)

### Release date 2025/07/15

**Features**

- Add support for AI Quick Replies

**Bug fixes**

- (iOS) Fix targeting polling not being disabled during conversation.

**Dependencies**

- React Native `0.79.2` > `0.80.1`
- React `19.0.0` > `19.1.0`
- Android Gradle Plugin `8.10.0` > `8.10.1`

# 4.4.0 (Gaperon)

### Release date 2025/05/30

**Features**

The visitor targeting workflow has been simplified.

You do not need to register the visitor navigation anymore.
Thus, the method `registerUserNavigation(navigationOption)` is now deprecated.

You now manage targeting using only these 2 methods:

- To engage the visitor, call `activateTargetingRule(targetingRule, channel)` (as you already do).
- To stop engaging the visitor, calls `deactivateTargetingRule()` (this is new).

Between these 2 calls, the iAdvize SDK automatically updates the targeting rule availability (every 30 seconds) and updates the chat button accordingly. 

If the update fails (e.g.: if there is no connection), you do not need to perform any special actions. The iAdvize SDK will try to update it again 30 seconds later.

*Activating a new rule*

```
// BEFORE
IAdvizeSDK.registerUserNavigation(NavigationOption.NEW, targetingRuleUUIDString, channel);

// AFTER: simply activate the new rule
IAdvizeSDK.activateTargetingRule(targetingRuleUUIDString, channel)
```

*Deactivating the rule*

```
// BEFORE
IAdvizeSDK.registerUserNavigation(NavigationOption.CLEAR, "", "");

// AFTER: deactivate the active rule
IAdvizeSDK.deactivateTargetingRule()
```

*Register user navigation (new screen)*

```
// BEFORE
IAdvizeSDK.registerUserNavigation(NavigationOption.KEEP, "", "");

// AFTER: Nothing to do the SDK handles it
```

**Bug fixes**
- (iOS) Fix rare crash in conversation (ConversationViewController.previewController(_:previewItemAt:)).

**Dependencies**

- Gradle `8.13` > `8.14`
- Android Gradle Plugin `8.9.2` > `8.10.0`
- Kotlin `2.1.10` > `2.1.20`
- Twilio `7.6.4` > `7.8.0`

This Twilio update ensures that the SDK is now compatible with the new Android `16 KB page sizes` feature.
https://developer.android.com/guide/practices/page-sizes

# 4.3.3 (Fourme)

### Release date 2025/04/29

**Bug fixes**

- (Android) Fix smaller chatbox animation possibly running on background thread
- (Android) Fix insets trying to apply on a detached view

**Dependencies**

The update of `google-play-services-basement` library to version `18.7` adds the obligation to activate `coreLibraryDesugaring` inside the apps integrating the iAdvize Mobile SDK (see https://developers.google.com/android/guides/releases#april_14_2025)

For more information on how to proceed, see https://developer.android.com/studio/write/java8-support#library-desugaring

# 4.3.2 (Fourme)

### Release date 2025/04/01

**Updated**

- (iOS) Add `Sendable` conformance to several public types.
- (iOS) Improve layout update of messages including a link preview.

**Bug fixes**

- (Android) Fix the toolbar color not updating correctly
- (iOS) Fix rare crash in `isRunningUnitTests()`.
- (iOS) Fix error log: *Unable to create a conversation manager: no visitor JWT...*.

# 4.3.1 (Fourme)

### Release date 2025/03/24

**Bug fixes**

- Fix auth token request management to avoid successive call on token expiration.
- (Android) Fix gesture navigation insets in chatbox.
- (Android) Fix some accessibility issues (TalkBack).
- (iOS) Fix wrong input area size when typing text.
- (iOS) Fix issue allowing to start a conversation without accepting GDPR.
- (iOS) Fix rare crash when loading messages (Index out of range).
- (iOS) Fix Voice Over losing focus when reloading messages.

**Dependencies**

- Gradle 8.10.2 > 8.13
- Android Gradle Plugin 8.6.1 > 8.9.0
- Kotlin 2.0.21 > 2.1.10
- Firebase 33.6.0 > 33.10.0

# 4.3.0 (Fourme)

### Release date 2025/02/20

**Features**

- Add `ChatboxConfiguration.isSmallerChatboxEnabled` API to present the Chatbox in compact mode. 

**Bug fixes**

- (iOS) Fix Auto Layout warnings displayed in the console.
- (Android) Fix default floating button insets for Android 15
- (Android) Fix some intempestive logs related to tracking & coroutines

# 4.2.6 (Epoisses)

### Release date 2025/02/03

**Updated**

- (iOS) The iAdvize SDK now uses `OSLog` (instead of `print`) to send logs to the operating system.

**Bug fixes**

- (Android) Fix crash in image viewer by downsampling bitmaps
- (iOS) Fix rare crash on logout caused by XMPP modules deinitialization.
- (iOS) Fix rare crash on logout caused by Keychain issue.

# 4.2.5 (Epoisses)

### Release date 2025/01/10

**Updated**

- (iOS) Update TwilioVideo to remove bitcode.

The iAdvize SDK had an obsolete dependency on the TwilioVideo framework, which still included bitcode. This could cause problems when submitting your application to AppStore Connect. The dependency has now been updated to the latest version (5.8.3), which no longer contains bitcode. 

**Bug fixes**

- Fix crash when initializing video call on iOS 18.

# 4.2.4 (Epoisses)

### Release date 2024/12/10

**Features**

- (Android) Updated UI to new product carrousel design

**Bug fixes**

- Fix TalkBack focus issue in message list
- Fix push notifications not being enabled on follow-up activations (see explanation below)
- (iOS) Fix useless calls performed after logout (access token refresh attempts).
- (iOS) Fix wrong font used in navigation bar title when using a custom font.
- (iOS) Fix inconsistent font size in messages when using a custom font.
- (iOS) Fix watchdog terminations caused by main thread being blocked by XMPP.
- (iOS) Fix wrong availability displayed in product card when a new message is received.

____

**Automatic Push Notifications Handling**

Push notifications are now **automatically enabled** every time a visitor is activated using IAdvizeSDK.activate(projectId:authenticationOption:gdprOption:completion:).

  - Previously, push notifications were only enabled during the first activation. After logout, they were disabled, requiring manual re-enablement on subsequent activations.

  - Now, push notifications will automatically re-enable during every activation, regardless of whether it’s the visitor’s first or a subsequent activation.

You only need to call IAdvizeSDK.enablePushNotifications if you previously disabled them using IAdvizeSDK.disablePushNotifications.

# 4.2.3 (Epoisses)

### Release date 2024/11/21

**Bug fixes**

- Fix missing typescript definitions in package

# 4.2.2 (Epoisses)

### Release date 2024/11/08

**Features**

- (Android) Migrate to Android permission-less Photo Picker
- (iOS) Add Privacy Manifest

**Bug fixes**

- (Android) Fix crash when opening downloaded files
- (iOS) Fix hangs or crashs that could occur when initializing the SDK
- (iOS) Fix rare crash caused by bad date formatting

**Dependencies**

- Update to React Native 0.75.4 / React 18.3.1
- (Android) Update to Android 35 / Kotlin 2 / Gradle 8.10 / AGP 8.6
- (iOS) Update to iOS 18 / Xcode 16

# 4.2.1 (Epoisses)

### Release date 2024/09/23

**Bug fixes**

- (Android) Fix obfuscation folder conflict with external libraries

# 4.2.0 (Epoisses)

### Release date 2024/09/17

**Features**

- Add debug info API to get SDK status
- Add targeting rule trigger failure callback
- Decrease severity of log when registering custom data outside of an ongoing conversation
- (Android) Encapsulate iAdvize SDK errors into their own types

# 4.1.5 (Dauphin)

### Release date 2024/08/13

**Bug fixes**

- (Android) Fix default floating button color update

# 4.1.4 (Dauphin)

### Release date 2024/07/13

**Bug fixes**

- Fix duplication of native bridge
- (iOS) Fix certain cases of authentication deadlock
- (iOS) Fix keychain error impacting transactions and video

# 4.1.3 (Dauphin)

### Release date 2024/07/03

**Features**

- Add a full debug log level (to use with caution, only with iAdvize approval to live debug)

# 4.1.2 (Dauphin)

### Release date 2024/06/25

**Bug fixes**

- (iOS) Fix the refreshed auth token not being added to the retry request

# 4.1.0 (Dauphin)

### Release date 2024/06/13

**Features**

- Migrate the XMPP messaging architecture from MUC/SUB to classic MUC

# 4.0.3 (Cantal)

### Release date 2024/06/07

**Bug fixes**

- (iOS) Fix XMPP handling for GenAI product info messages

# 4.0.2 (Cantal)

### Release date 2024/05/30

**Bug fixes**

- Add missing callback on `logout` API
- (Android) Fix isolated markdown deeplink handling

# 4.0.1 (Cantal)

### Release date 2024/05/14

**Bug fixes**

- Fix line feed escaping breaking markdown syntax in bot messages
- (Android) Fix text selection breaking markdown link handling

# 4.0.0 (Cantal)

### Release date 2024/04/16

**Features**

- Fixed the Secured Authentication flow being wrongly synchronous. This is a breaking API change, thus the major version update.

# 3.4.7 (Cantal)

### Release date 2024/04/11

**Bug fixes**

- (Android) Fix secured preferences initialization issue in case of modified decryption key

# 3.4.6 (Cantal)

### Release date 2024/04/09

**Features**

- (Android) Add copy-paste selection in messages

**Bug fixes**

- (Android) Fix secured preferences initialization issue with Android auto-backup strategy

# 3.4.5 (Cantal)

### Release date 2024/03/19

**Features**

- (Android) Rework the initiate API, adding a callback + implementing retry behavior

**Bug fixes**

- Fix markdown links not triggering the SDK click handler
- (Android) Fix a crash occuring when visitor spam messages
- (Android) Add some missing obfuscation instructions
- (iOS) Fix deadlock state in case of first XMPP connection error

# 3.4.4 (Cantal)

### Release date 2024/01/18

**Features**

- Clear iAdvize Push Notifications on chatbox opening
- Add an API for clearing iAdvize Push Notifications on demand

**Bug fixes**

- (iOS) Fix a UI thread crash when displaying error view
- (iOS) Fix the default browser opening on link clicks

# 3.4.3 (Cantal)

### Release date 2023/12/21

**Features**

- Support simple Markdown syntax inside QuickReply messages
- Add some translations for GDPR messages (cs, da, pl, sk, sv)
- Add API to unset GDPR & Secured Auth listeners

**Bug fixes**

- (Android) Fix a display issue on ProductOffer messages when no offer pric is set
- (iOS) Fix GDPR mode not updating after multiple activations

**Dependencies**

- (Android) Removed deprecated `play-services-safetynet` dependency in favor of `play-services-basement`

# 3.4.2 (Cantal)

### Release date 2023/12/06

**Features**

- (iOS) Support multiline in QuickReply choices

**Bug fixes**

- (Android) Fix potential stuck state during GDPR process
- (Android) Fix conversation not being started properly if network disconnects during MUC/SUB subscription
- (Android) Remove OnBackPressedHandler which was causing issues in ReactNative back button handling
- (iOS) Add missing completion call on secured auth activation failure callback
- (iOS) Fix conversation closing regression caused by the token refresh strategy

**Dependencies**

The iAdvize SDK Android plugin dependencies were aligned to use React Native `0.72.7` default dependencies to avoid build conflicts:

- React `18.2.0`
- Kotlin `1.7.22`
- Gradle `7.6`
- Android Gradle Plugin `7.4.1`
- Android minimum SDK `33`
- Android SDK Target `33`
- Android SDK Build Tools `33.0.2`

# 3.4.1 (Cantal)

This version was discontinued due to build issues. Please use the version `3.4.2`.

# 3.4.0 (Cantal)

### Release date 2023/10/24

**Features**

- Add automatic auth token refresh management
- Remove preview image when it is empty (previously used a placeholder)
- Add `onChatboxOpened` & `onChatboxClosed` API

**Bug fixes**

- Fix web & markdown links display
- (iOS) Fix QuickReplies hit detection when no avatar is set
- (iOS) Review of Chatbox APIs computation on main UI thread

**Dependencies**

- (iOS) Xcode target `14.2` -> `15.0`
- (Android) Gradle Plugin `8.1.0` -> `8.1.1`

# 3.3.0 (Beaufort)

### Release date 2023/08/09

**Features**

- Allow a more sophisticated message color customization
- Add a LogLevel mode to remove all logs

**Bug fixes**

- Fix conversation management after various network connection issues (phone sleep / app in bakground)
- (iOS) Fix secured auth token concurrency spam

**Dependencies**

- (iOS) Updated min supported iOS platform from `12.0` to `13.0`
- (Android) Gradle Plugin `7.4.1` -> `8.1.0`
- (Android) Build Tools `33.0.1` -> `33.0.2`
- (Android) Kotlin `1.8.10` -> `1.8.21`

# 3.2.3 (Angelot)

### Release date 2023/07/24

**Bug fixes**

- Fix wrong type of `isActiveTargetingRuleAvailable` (`number` -> `boolean`)
- Fix missing header in iOS bridge

# 3.2.2 (Angelot)

### Release date 2023/06/29

**Features**

- ReactNative 0.72 support

**Bug fixes**

- (iOS) Fix threading issue for `presentChabtox` API
- (iOS) Fix behavior of `setDefaultFloatingButton` API
- (Android) Fix `ChatboxConfiguration.mainColor` defaulting to white if not set

# 3.2.1 (Angelot)

### Release date 2023/05/31

**Bug fixes**

- (iOS) Fix video conversation flow wrongly changing the conversation channel
- Fix font update on several message types

# 3.2.0 (Angelot)

### Release date 2023/05/25

**Features**

- Disable file attachment buttons when it is disabled in Admin chatbox template

**Bug fixes**

- (iOS) Fix camera still opening after manual permission removal
- (iOS) Fix targeting listener not being triggered when there is an ongoing conversation
- (iOS) Fix ongoing conversation being returned as true after closing a video conversation
- (Android) Fix message alignment

# 3.1.1

### Release date 2023/03/30

**Bug fixes**

- (Android)) Fix message alignment

# 3.1.0

### Release date 2023/03/29

**Features**

- Disable satisfaction survey after failed bot transfer if parametrized in the admin
- Handle the Estimated Waiting Time messages

**Bug fixes**

- (Android) Fix pre-conversation custom data not being sent on conversation start
- (Android) Fix targeting process not being fully restarted after conversation end
- (Android) Fix build issue with wrong Kotlin version variable

# 3.0.3

### Release date 2023/02/15

**Features**

- (iOS) Embed XMPPFramwork inside XCFramework artifact (Twilio is now the only external SDK dependency)

**Bug fixes**

- (iOS) Fix bug in framework generation causing upload issues for integrating app

# 3.0.1

### Release date 2023/02/09

**Bug fixes**

- (iOS) Fix bot conversation starting without user GDPR consent
- (Android) Fix file picker permissions on Android 13

# 3.0.0

### Release date 2022/12/30

> *⚠️ This release brings breaking API changes.*

**Features**

- Rename API for clarity (Iadvize => IAdvizeSDK / IadvizeListeners => IAdvizeSDKListeners)
- Add the Listener GDPROption to implement a custom behavior on user "More info" click
- Add the Secured AuthenticationOption for secured authentication process
- Add Chatbox API (presentChatbox / dismissChatbox / isChatboxPresented)
- Add notification API (isIAdvizePushNotification)
- Add Custom Data API (registerCustomData) to save visitor custom data

See UPGRADING.md or the [official documentation](https://developers.iadvize.com/documentation/mobile-sdk) for deeper explanations on those features.

**Bug fixes**

- Fix NPS values to 0-10 (was 1-10)

# 2.8.2

### Release date 2022/12/09

**Features**

- Add support for visitor blocking (Android & iOS)

**Bug fixes**

- Fix intempestive "new message" badge showing on default floating button (Android)
- Fix log levels on several warning stack traces (Android)
