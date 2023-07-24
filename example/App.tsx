import * as React from 'react';

import { StyleSheet, Image, Linking, View, Button } from 'react-native';
import IAdvizeSDK, {
  IAdvizeSDKListeners,
  LogLevel,
  ApplicationMode,
  ChatboxConfiguration,
  Transaction,
  ConversationChannel,
  NavigationOption,
} from '@iadvize-oss/iadvize-react-native-sdk';

export default function App() {
  React.useEffect(() => {
    IAdvizeSDK.setLanguage('fr');
    IAdvizeSDK.setLogLevel(LogLevel.VERBOSE);
    IAdvizeSDK.setDefaultFloatingButton(true);
    IAdvizeSDK.setFloatingButtonPosition(25, 25);

    IAdvizeSDKListeners.onGDPRMoreInfoClicked(function (eventData: any) {
      console.log('onGDPRMoreInfoClicked', eventData);
    });

    IAdvizeSDKListeners.onActiveTargetingRuleAvailabilityUpdated(function (eventData: any) {
      console.log('onActiveTargetingRuleAvailabilityChanged', eventData);
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

  }, []);

  const activateSDK = async () => {
    try {
      // TODO: replace with your projectId / userId
      await IAdvizeSDK.activate(-1, "userId", null);
      console.log('iAdvize SDK activated');
    } catch (e) {
      console.log('iAdvize SDK not activated');
      console.error(e);
    }
  };

  const activateTargetingRule = async () => {
    // TODO: replace with your targetingRuleId
    IAdvizeSDK.activateTargetingRule("targetingRuleId", ConversationChannel.CHAT);
  };

  const logout = async () => {
    IAdvizeSDK.logout();
  };

  const registerUserNavigation = async () => {
    IAdvizeSDK.registerUserNavigation(NavigationOption.CLEAR, "", ConversationChannel.CHAT);
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
    const configuration: ChatboxConfiguration = {
      mainColor: '#000000',
      navigationBarBackgroundColor: '#000000',
      navigationBarMainColor: '#00FF00',
      navigationBarTitle: 'Conversation',
      fontName: 'AmericanTypewriter-Condensed',
      fontSize: 11,
      fontPath: '/',
      automaticMessage: 'Hello! Please ask your question :)',
      gdprMessage: 'Your own GDPR message.',
      incomingMessageAvatarImageName: Image.resolveAssetSource(require('./test.jpeg')).uri, // Will take precedence over AvatarURL
      incomingMessageAvatarURL: 'https://picsum.photos/200/200',
    };
    IAdvizeSDK.setChatboxConfiguration(configuration);
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
      "Test": "Test",
      "Test2": false,
      "Test3": 2.5,
      "Test4": 3
    };
    IAdvizeSDK.registerCustomData(customData);
  };

  const ongoingConversationId = async () => {
    const convId = IAdvizeSDK.ongoingConversationId();
    console.log(`iAdvize SDK conversationId: ${ convId }`);
  };

  const ongoingConversationChannel = async () => {
    const convChannel = IAdvizeSDK.ongoingConversationChannel();
    console.log(`iAdvize SDK conversationChannel: ${ convChannel }`);
  };

  return (
    <View style={styles.container}>
      <Button title="Activate" onPress={() => activateSDK()} />
      <View style={styles.margin} />
      <Button
        title="Activate Targeting Rule"
        onPress={() => activateTargetingRule()}
      />
      <View style={styles.margin} />
      <Button title="Logout" onPress={() => logout()} />
      <View style={styles.margin} />
      <Button
        title="Register UserNavigation"
        onPress={() => registerUserNavigation()}
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
        title="Print Conversation Channel"
        onPress={() => ongoingConversationChannel()}
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
    height: 10,
  },
});
