import type { ApplicationMode, ConversationChannel, LogLevel, NavigationOption } from '../enums';
import type { ChatboxConfiguration, Transaction } from '.';

export type IadvizeType = {
  // Activation
  activate(
    projectId: number,
    userId: string,
    gdprURL: string
  ): Promise<boolean>;
  // Logging 
  setLogLevel(logLevel: LogLevel): void;
  // Targeting
  setLanguage(language: string): void;
  activateTargetingRule(uuid: string, conversationChannel: ConversationChannel): void;
  isActiveTargetingRuleAvailable(): number; // iOS Only
  setOnActiveTargetingRuleAvailabilityListener(): void;
  onActiveTargetingRuleAvailabilityUpdatedListener: any;
  registerUserNavigation(navigationOption: NavigationOption, uuid: string, conversationChannel: ConversationChannel): void;
  // Conversation
  hasOngoingConversation(): number;
  setConversationListener(): void;
  onOngoingConversationStatusChangedListener: any;
  onNewMessageReceivedListener: any;
  handleClickedUrlListener: any;
  // Push notifications
  registerPushToken(pushToken: string, ApplicationMode: ApplicationMode): void;
  enablePushNotifications(): Promise<boolean>;
  disablePushNotifications(): Promise<boolean>;
  // Chatbox
  setDefaultFloatingButton(active: boolean): void;
  setFloatingButtonPosition(leftMargin: number, bottomMargin: number): void;
  setChatboxConfiguration(configuration: ChatboxConfiguration): void;
  // Transaction
  registerTransaction(transaction: Transaction): void;
  // Logout
  logout(): void;
};
