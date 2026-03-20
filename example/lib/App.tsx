import * as React from 'react';

import { Button, Image, Linking, StyleSheet, View } from 'react-native';
import IAdvizeSDK, {
  IAdvizeSDKListeners,
  LogLevel,
  ApplicationMode,
  ChatboxConfiguration,
  Transaction
} from '@iadvize-oss/iadvize-react-native-sdk';

// TODO replace with your own values
const projectId = -1
const userId = "userId"
const targetingRuleId = "targetingRuleId"
const customChatboxConfiguration: ChatboxConfiguration = {
  iosFontName: 'AmericanTypewriter-Condensed',
  iosFontSize: 11,
  androidFontPath: 'fonts/comicneue_regular.ttf',

  primaryColor: '#0B08D9',
  primaryTextColor: '#FFFFFF',
  secondaryColor: '#F39600',
  secondaryTextColor: '#3D3D38',

  title: 'Custom Header Title',
  avatar: Image.resolveAssetSource(require('./header.png')).uri,

  automaticMessage: 'Hello! Please ask your question :)',
  gdprMessage: 'Your own custom GDPR message.'
};

export default function App() {
  React.useEffect(() => {
    IAdvizeSDK.setLanguage('en');
    IAdvizeSDK.setLogLevel(LogLevel.VERBOSE);
    IAdvizeSDK.setDefaultFloatingButton(true);
    IAdvizeSDK.setFloatingButtonPosition(25, 25);

    IAdvizeSDKListeners.onGDPRMoreInfoClicked(function (eventData: any) {
      console.log('onGDPRMoreInfoClicked', eventData);
    });

    IAdvizeSDKListeners.onActiveTargetingRuleAvailabilityUpdated(function (eventData: any) {
      console.log('onActiveTargetingRuleAvailabilityChanged', eventData);
    });

    IAdvizeSDKListeners.onActiveTargetingRuleAvailabilityUpdateFailed(function (eventData: any) {
      console.log('onActiveTargetingRuleAvailabilityUpdateFailed', eventData.code, "=>", eventData.message);
    });

    IAdvizeSDKListeners.onOngoingConversationStatusChanged(function (eventData: any) {
      console.log('onOngoingConversationStatusChanged', eventData);
    });

    IAdvizeSDKListeners.onNewMessageReceived(function (eventData: any) {
      console.log('onNewMessageReceived', eventData);
    });

    IAdvizeSDKListeners.handleClickedUrl(function (eventData: any) {
      console.log('handleClickedUrl', eventData);

      // Manage the clicked url as you wish
      Linking.openURL(eventData.uri);
    });

    IAdvizeSDKListeners.onChatboxOpened(function (eventData: any) {
      console.log('onChatboxOpened', eventData);
    });

    IAdvizeSDKListeners.onChatboxClosed(function (eventData: any) {
      console.log('onChatboxClosed', eventData);
    });

  }, []);

  const activateSDK = async () => {
    try {
      await IAdvizeSDK.activate(projectId, userId, null);
      console.log('iAdvize SDK activated');
    } catch (e) {
      console.log('iAdvize SDK not activated');
      console.error(e);
    }
  };

  const logout = async () => {
    try {
      await IAdvizeSDK.logout();
      console.log('Successfully logged out of iAdvize SDK');
    } catch (e) {
      console.log('Error while logging out of iAdvize SDK');
      console.error(e);
    }
  };

  const activateTargetingRule = async () => {
    IAdvizeSDK.activateTargetingRule(targetingRuleId);
  };

  const deactivateTargetingRule = async () => {
    IAdvizeSDK.deactivateTargetingRule();
  };

  const registerPushToken = async () => {
    IAdvizeSDK.registerPushToken('12345-67890', ApplicationMode.DEV);
  };

  const enablePushNotifications = async () => {
    try {
      await IAdvizeSDK.enablePushNotifications();
      console.log('iAdvize SDK enablePushNotifications success');
    } catch (e) {
      console.log('iAdvize SDK enablePushNotifications failure');
      console.error(e);
    }
  };

  const disablePushNotifications = async () => {
    try {
      await IAdvizeSDK.disablePushNotifications();
      console.log('iAdvize SDK disablePushNotifications success');
    } catch (e) {
      console.log('iAdvize SDK disablePushNotifications failure');
      console.error(e);
    }
  };

  const setChatboxConfiguration = async () => {
    IAdvizeSDK.setChatboxConfiguration(customChatboxConfiguration);
  };

  const registerTransaction = async () => {
    const transaction: Transaction = {
      transactionId: 'transactionId',
      currency: 'EUR',
      amount: 100,
    };
    IAdvizeSDK.registerTransaction(transaction);
  };

  const registerCustomData = async () => {
    // String Key - Values can be String/Int/Double/Boolean
    var customData = {
      "android-device-version": 33,
      "iadvize-sdk-version": "3.4.5",
      "random-number": 3.14
    };
    IAdvizeSDK.registerCustomData(customData);
  };

  const ongoingConversationId = async () => {
    const convId = IAdvizeSDK.ongoingConversationId();
    console.log(`iAdvize SDK conversationId: ${ convId }`);
  };

  const debugInfo = async () => {
    const debugInfo = IAdvizeSDK.debugInfo();
    console.log(`Debug info: ${ debugInfo }`);
  };

  return (
    <View style={styles.container}>
      <Button title="Activate" onPress={() => activateSDK()} />
      <View style={styles.margin} />
      <Button title="Logout" onPress={() => logout()} />
      <View style={styles.margin} />
      <Button
        title="Activate Targeting Rule"
        onPress={() => activateTargetingRule()}
      />
      <View style={styles.margin} />
      <Button
        title="Deactivate Targeting Rule"
        onPress={() => deactivateTargetingRule()}
      />
      <View style={styles.margin} />
      <Button title="Register Push Notif" onPress={() => registerPushToken()} />
      <View style={styles.margin} />
      <Button
        title="enable Push Notifications"
        onPress={() => enablePushNotifications()}
      />
      <View style={styles.margin} />
      <Button
        title="disable Push Notifications"
        onPress={() => disablePushNotifications()}
      />
      <View style={styles.margin} />
      <Button
        title="Set ChatboxConfiguration"
        onPress={() => setChatboxConfiguration()}
      />
      <View style={styles.margin} />
      <Button
        title="Register Transaction"
        onPress={() => registerTransaction()}
      />
      <View style={styles.margin} />
      <Button
        title="Register custom data"
        onPress={() => registerCustomData()}
      />
      <View style={styles.margin} />
      <Button
        title="Print Conversation Id"
        onPress={() => ongoingConversationId()}
      />
      <View style={styles.margin} />
      <Button
        title="Print Debug Info"
        onPress={() => debugInfo()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  margin: {
    height: 8,
  },
});
