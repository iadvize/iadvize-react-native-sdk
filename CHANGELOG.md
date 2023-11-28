# 3.4.1 (Cantal)

### Release date 2023/11/28

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
- Gradle `8.0.1`
- Android Gradle Plugin `7.4.2`
- Android SDK Target `34`
- Android SDK Build Tools `34.0.0`

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
