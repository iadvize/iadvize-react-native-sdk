import { NativeModules, NativeEventEmitter } from 'react-native';
import type { IadvizeProtocolType } from './';

const { Iadvize } = NativeModules;

const moduleIadvizeEmitter = new NativeEventEmitter(Iadvize);

const activeTargetingRuleAvailabilityUpdatedEvent =
  'iadvize_activeTargetingRuleAvailabilityUpdated';
const onOngoingConversationStatusChangedEvent =
  'iadvize_onOngoingConversationStatusChanged';
const onNewMessageReceivedEvent = 'iadvize_onNewMessageReceived';
const handleClickedUrlEvent = 'iadvize_handleClickedUrl';

var IadvizeProtocol: IadvizeProtocolType = {};

IadvizeProtocol.onActiveTargetingRuleAvailabilityUpdated = function (
  listener: (...args: any[]) => any
) {
  if (Iadvize.onActiveTargetingRuleAvailabilityUpdatedListener == null) {
    Iadvize.setOnActiveTargetingRuleAvailabilityListener();
    Iadvize.onActiveTargetingRuleAvailabilityUpdatedListener =
      moduleIadvizeEmitter.addListener(
        activeTargetingRuleAvailabilityUpdatedEvent,
        listener
      );
  }
};

IadvizeProtocol.onOngoingConversationStatusChanged = function (
  listener: (...args: any[]) => any
) {
  if (Iadvize.onOngoingConversationStatusChangedListener == null) {
    Iadvize.setConversationListener();
    Iadvize.onOngoingConversationStatusChangedListener =
      moduleIadvizeEmitter.addListener(
        onOngoingConversationStatusChangedEvent,
        listener
      );
  }
};

IadvizeProtocol.onNewMessageReceived = function (
  listener: (...args: any[]) => any
) {
  if (Iadvize.onNewMessageReceivedListener == null) {
    Iadvize.setConversationListener();
    Iadvize.onNewMessageReceivedListener = moduleIadvizeEmitter.addListener(
      onNewMessageReceivedEvent,
      listener
    );
  }
};

IadvizeProtocol.handleClickedUrl = function (
  listener: (...args: any[]) => any
) {
  if (Iadvize.handleClickedUrlListener == null) {
    Iadvize.setConversationListener();
    Iadvize.handleClickedUrlListener = moduleIadvizeEmitter.addListener(
      handleClickedUrlEvent,
      listener
    );
  }
};

export const IadvizeListeners = IadvizeProtocol;
