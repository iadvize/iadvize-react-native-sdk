
### 1. Create the Expo project
```
npx create-expo-app@latest expo-test-idz
cd expo-test-idz
npx expo install --fix
```

### 2. Add iAdvize Mobile SDK & expo-build-properties dependencies

```
npx expo install expo-build-properties
npx expo install @iadvize-oss/iadvize-react-native-sdk@4.3.3-kotlin1
```

### 3. Configure iAdvize SDK properties via `expo-build-properties` in `app.json`

```
{
  "expo": {
    ...

    "ios": {
      ...

      "infoPlist": {
        "NSCameraUsageDescription": "This application will use the camera to share photos and during video calls.",
        "NSMicrophoneUsageDescription": "This application will use the microphone during video calls."
      }
    },
    "plugins": [
      ...

      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 35,
            "targetSdkVersion": 35,
            "buildToolsVersion": "35.0.0",
            "minSdkVersion": 24
          },
          "ios": {
            "deploymentTarget": "15.1"
          }
        }
      ],
      "./iadvize.config.js"
    ],
    ...
  }
}
```

### 4. Generate native code

```
npx expo prebuild --clean
```

### 5. Activate iAdvize Mobile SDK

```
<Button title="Activate iAdvize SDK" onPress={() => activateSDK()} />
```

```
const activateSDK = () => {
  IAdvizeSDK.setLogLevel(LogLevel.VERBOSE);
  IAdvizeSDK.setLanguage('en');
  IAdvizeSDK.setDefaultFloatingButton(true);
  IAdvizeSDK.setFloatingButtonPosition(25, 25);
  IAdvizeSDK.activate(PROJECT_ID, USER_ID, null).then( success => {
    if (success == true) {
      console.log('iAdvize SDK activated');
      IAdvizeSDK.activateTargetingRule(TARGETING_RULE_ID, ConversationChannel.CHAT);
    } else {
      console.log('Error activating iAdvize SDK');
    }
  });
};
```

### 6. Run the project

```
npx expo run android
```
