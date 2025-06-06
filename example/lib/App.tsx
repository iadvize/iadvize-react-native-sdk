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
      // TODO: replace with your projectId / userId
      await IAdvizeSDK.activate(-1, "userId", null);
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
    // TODO: replace with your targetingRuleId
    IAdvizeSDK.activateTargetingRule("targetingRuleId", ConversationChannel.CHAT);
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
    const configuration: ChatboxConfiguration = {
      fontName: 'AmericanTypewriter-Condensed',
      fontSize: 11,
      fontPath: '/',

      incomingMessageBackgroundColor: '#EEEFF0',
      incomingMessageTextColor: '#34393F',
      outgoingMessageBackgroundColor: '#320087',
      outgoingMessageTextColor: '#EEEFF0',
      accentColor: '#FFBF32',

      navigationBarBackgroundColor: '#FFBF32',
      navigationBarMainColor: '#320087',
      navigationBarTitle: 'Toolbar custom title',

      automaticMessage: 'Hello! Please ask your question :)',
      gdprMessage: 'Your own custom GDPR message.',
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
        title="Print Conversation Channel"
        onPress={() => ongoingConversationChannel()}
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
