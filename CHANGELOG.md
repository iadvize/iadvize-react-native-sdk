# 3.2.3

### Release date 2023/07/24

**Bug fixes**

- Fix wrong type of `isActiveTargetingRuleAvailable` (`number` -> `boolean`)
- Fix missing header in iOS bridge


# 3.2.2

### Release date 2023/06/29

**Features**

- ReactNative 0.72 support

**Bug fixes**

- (iOS) Fix threading issue for `presentChabtox` API
- (iOS) Fix behavior of `setDefaultFloatingButton` API
- (Android) Fix `ChatboxConfiguration.mainColor` defaulting to white if not set

# 3.2.1

### Release date 2023/05/31

**Bug fixes**

- (iOS) Fix video conversation flow wrongly changing the conversation channel
- Fix font update on several message types

# 3.2.0

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
