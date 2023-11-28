import * as React from 'react';

import { Linking } from 'react-native';
// import IAdvizeSDK, {
//   IAdvizeSDKListeners,
//   LogLevel,
// } from '@iadvize-oss/iadvize-react-native-sdk';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import Nested from './Nested';

const Stack = createNativeStackNavigator();

export default function App() {
  // React.useEffect(() => {
    // IAdvizeSDK.setLanguage('fr');
    // IAdvizeSDK.setLogLevel(LogLevel.VERBOSE);
    // IAdvizeSDK.setDefaultFloatingButton(true);
    // IAdvizeSDK.setFloatingButtonPosition(25, 25);

    // IAdvizeSDKListeners.onGDPRMoreInfoClicked(function (eventData: any) {
    //   console.log('onGDPRMoreInfoClicked', eventData);
    // });

    // IAdvizeSDKListeners.onActiveTargetingRuleAvailabilityUpdated(function (eventData: any) {
    //   console.log('onActiveTargetingRuleAvailabilityChanged', eventData);
    // });

    // IAdvizeSDKListeners.onOngoingConversationStatusChanged(function (eventData: any) {
    //   console.log('onOngoingConversationStatusChanged', eventData);
    // });

    // IAdvizeSDKListeners.onNewMessageReceived(function (eventData: any) {
    //   console.log('onNewMessageReceived', eventData);
    // });

    // IAdvizeSDKListeners.handleClickedUrl(function (eventData: any) {
    //   console.log('handleClickedUrl', eventData);

    //   // Manage the clicked url as you wish
    //   Linking.openURL(eventData.uri);
    // });

    // IAdvizeSDKListeners.onChatboxOpened(function (eventData: any) {
    //   console.log('onChatboxOpened', eventData);
    // });

    // IAdvizeSDKListeners.onChatboxClosed(function (eventData: any) {
    //   console.log('onChatboxClosed', eventData);
    // });
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Nested" component={Nested} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
