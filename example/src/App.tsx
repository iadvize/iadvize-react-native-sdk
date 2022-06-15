import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import Iadvize, {
  IadvizeListeners,
  LogLevel,
  ApplicationMode,
  ChatboxConfiguration,
  Transaction,
  ConversationChannel,
  NavigationOption,
} from '@iadvize-oss/iadvize-react-native-sdk';

export default function App() {
  React.useEffect(() => {
    Iadvize.setLanguage('fr');
    Iadvize.setLogLevel(LogLevel.VERBOSE);
    Iadvize.setDefaultFloatingButton(true);
    Iadvize.setFloatingButtonPosition(25, 25);

    IadvizeListeners.onActiveTargetingRuleAvailabilityUpdated?.(function (
      data: any
    ) {
      console.log('onActiveTargetingRuleAvailabilityChanged called');
      console.log(data);
    });

    IadvizeListeners.onOngoingConversationStatusChanged?.(function (data: any) {
      console.log('onOngoingConversationStatusChanged called');
      console.log(data);
    });

    IadvizeListeners.onNewMessageReceived?.(function (data: any) {
      console.log('onNewMessageReceived called');
      console.log(data);
    });

    IadvizeListeners.handleClickedUrl?.(function (data: any) {
      console.log('handleClickedUrl called');
      console.log(data);
    });
  }, []);

  const activateSDK = async () => {
    try {
      // TODO: replace by your projectId
      await Iadvize.activate(3585, 'userId', null);
      console.log('iAdvize SDK activated');
    } catch (e) {
      console.log('iAdvize SDK not activated');
      console.error(e);
    }
  };

  const activateTargetingRule = async () => {
    // TODO: replace by your targetingRuleId
    Iadvize.activateTargetingRule("e1e3019f-6d3e-460f-9eed-ead015adf9e4", ConversationChannel.CHAT);
  };

  const logout = async () => {
    Iadvize.logout();
  };

  const registerUserNavigation = async () => {
    Iadvize.registerUserNavigation(NavigationOption.clear, "", ConversationChannel.CHAT);
  };

  const registerPushToken = async () => {
    Iadvize.registerPushToken('12345-67890', ApplicationMode.DEV);
  };

  const enablePushNotifications = async () => {
    try {
      await Iadvize.enablePushNotifications();
      console.log('iAdvize SDK enablePushNotifications success');
    } catch (e) {
      console.log('iAdvize SDK enablePushNotifications failure');
      console.error(e);
    }
  };

  const disablePushNotifications = async () => {
    try {
      await Iadvize.disablePushNotifications();
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
      incomingMessageAvatarImageName: 'image',
      incomingMessageAvatarURL: 'https://image.test',
    };
    Iadvize.setChatboxConfiguration(configuration);
  };

  const registerTransaction = async () => {
    const transaction: Transaction = {
      transactionId: 'transactionId',
      currency: 'EUR',
      amount: 100,
    };
    Iadvize.registerTransaction(transaction);
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
