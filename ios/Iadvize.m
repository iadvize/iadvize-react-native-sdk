#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(Iadvize, NSObject)

RCT_EXTERN_METHOD(activate:(nonnull NSNumber *)projectId
                  userId:(NSString *)userId
                  legalInfoUrl:(NSString *)legalInfoUrl
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(activateTargetingRule:(NSString *)uuid)

RCT_EXTERN_METHOD(setLogLevel:(nonnull NSNumber *)logLevel)

RCT_EXTERN_METHOD(logout)

RCT_EXTERN_METHOD(registerUserNavigation)

RCT_EXTERN_METHOD(setLanguage:(NSString *)language)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isActiveTargetingRuleAvailable)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(hasOngoingConversation)

RCT_EXTERN_METHOD(registerPushToken:(NSString *)pushToken applicationMode:(NSString *)applicationMode)

RCT_EXTERN_METHOD(setChatboxConfiguration:(NSDictionary *)configuration)

RCT_EXTERN_METHOD(setOnActiveTargetingRuleAvailabilityListener)

RCT_EXTERN_METHOD(setConversationListener)

RCT_EXTERN_METHOD(enablePushNotifications:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(disablePushNotifications:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setChatboxConfiguration:(NSDictionary *)configuration)

RCT_EXTERN_METHOD(setDefaultChatButton:(BOOL))

RCT_EXTERN_METHOD(setChatButtonPosition:(nonnull NSNumber *)leftMargin bottomMargin:(nonnull NSNumber *)bottomMargin)

RCT_EXTERN_METHOD(registerTransaction:(NSDictionary *)transaction)

@end
