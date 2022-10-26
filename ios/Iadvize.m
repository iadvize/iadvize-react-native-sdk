#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(Iadvize, NSObject)

RCT_EXTERN_METHOD(activate:(nonnull NSNumber *)projectId
                  userId:(NSString *)userId
                  legalInfoUrl:(NSString *)legalInfoUrl
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(activateTargetingRule:(NSString *)uuid channel:(NSString *)channel)

RCT_EXTERN_METHOD(setLogLevel:(nonnull NSNumber *)logLevel)

RCT_EXTERN_METHOD(logout)

RCT_EXTERN_METHOD(registerUserNavigation:(NSString *)navigationOption uuid:(NSString *)uuid channel:(NSString *)channel)

RCT_EXTERN_METHOD(setLanguage:(NSString *)language)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isActiveTargetingRuleAvailable)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(ongoingConversationId)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(ongoingConversationChannel)

RCT_EXTERN_METHOD(registerPushToken:(NSString *)pushToken applicationMode:(NSString *)applicationMode)

RCT_EXTERN_METHOD(setChatboxConfiguration:(NSDictionary *)configuration)

RCT_EXTERN_METHOD(setOnActiveTargetingRuleAvailabilityListener)

RCT_EXTERN_METHOD(setConversationListener)

RCT_EXTERN_METHOD(enablePushNotifications:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(disablePushNotifications:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setChatboxConfiguration:(NSDictionary *)configuration)

RCT_EXTERN_METHOD(setDefaultFloatingButton:(BOOL))

RCT_EXTERN_METHOD(setFloatingButtonPosition:(nonnull NSNumber *)leftMargin bottomMargin:(nonnull NSNumber *)bottomMargin)

RCT_EXTERN_METHOD(registerTransaction:(NSDictionary *)transaction)

RCT_EXTERN_METHOD(presentChatbox)

RCT_EXTERN_METHOD(dismissChatbox)

@end
