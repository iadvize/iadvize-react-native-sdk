import IAdvizeConversationSDK

extension ConversationChannel {
    static func fromString(_ channel: String) -> ConversationChannel {
        switch channel.uppercased() {
        case "VIDEO":
            return .video
        case "CHAT":
            return .chat
        default:
            return .chat
        }
    }
}

extension NavigationOption {
    static func fromString(_ navigationOption: String, uuid: String, channel: String) -> NavigationOption {
        switch navigationOption.uppercased() {
            case "CLEAR":
                return .clearActiveRule
            case "KEEP":
                return .keepActiveRule
            case "NEW":
                guard let uuid = UUID(uuidString: uuid) else {
                    print("Unable to activate targeting rule: targeting rule id not valid")
                    return .clearActiveRule
                }
                let channel = ConversationChannel.fromString(channel)
                let targetingRule = TargetingRule(id: uuid, conversationChannel: channel)
                return .activateNewRule(targetingRule: targetingRule)
            default:
                return .clearActiveRule
        }
    }
}

@objc(Iadvize)
class Iadvize: RCTEventEmitter {
    
    override func supportedEvents() -> [String]! {
        return ["iadvize_activeTargetingRuleAvailabilityUpdated",
                "iadvize_onOngoingConversationStatusChanged",
                "iadvize_onNewMessageReceived",
                "iadvize_handleClickedUrl"]
    }
    
    //MARK: Activation
    
    @objc(activate:userId:legalInfoUrl:withResolver:withRejecter:)
    func activate(projectId: NSNumber,
                  userId: String,
                  legalInfoUrl: String,
                  resolve:@escaping RCTPromiseResolveBlock,
                  reject:@escaping RCTPromiseRejectBlock) -> Void {
        
        DispatchQueueHelpers.runOnMainThread {
            let rgpdOption: IAdvizeConversationSDK.GDPROption = URL(string: legalInfoUrl) != nil ? .enabled(option: .legalInformation(url: URL(string: legalInfoUrl)!)) : .disabled

            let authenticationOption: IAdvizeConversationSDK.AuthenticationOption = {
                guard userId.isEmpty == false else {
                    return .anonymous
                }
                return .simple(userId: userId)
            }()

            IAdvizeSDK.shared.activate(projectId: Int(projectId),
                                       authenticationOption: authenticationOption,
                                       gdprOption: rgpdOption){ success in
                if success {
                    resolve(true)
                }else{
                    reject("0", "", nil)
                }
            }
        }
    }
    
    //MARK: Logging
    
    @objc(setLogLevel:)
    func setLogLevel(value: NSNumber) -> Void {
        print("iAdvize iOS SDK - setLogLevel called with \(value)")
        IAdvizeSDK.shared.logLevel = logLevelFrom(value: value)
    }
    
    func logLevelFrom(value: NSNumber) -> IAdvizeConversationSDK.Logger.LogLevel{
        switch value {
        case 0: return .verbose
        case 1: return .info
        case 2: return .warning
        case 3: return .error
        case 4: return .success
        default: return .verbose
        }
    }
    
    //MARK: Targeting
    
    @objc(setLanguage:)
    func setLanguage(language: String) -> Void {
        print("iAdvize iOS SDK - setLanguage called with \(language)")
        IAdvizeSDK.shared.targetingController.language = .custom(value: Language(rawValue: language.lowercased()) ?? .fr)
    }
    
    @objc(activateTargetingRule:channel:)
    func activateTargetingRule(uuid: String, channel: String) -> Void {
        DispatchQueueHelpers.runOnMainThread {
            guard let uuid = UUID(uuidString: uuid) else {
                print("Unable to activate targeting rule: targeting rule id not valid")
                return
            }
            let channel = ConversationChannel.fromString(channel)
            let targetingRule = TargetingRule(id: uuid, conversationChannel: channel)
            IAdvizeSDK.shared.targetingController.activateTargetingRule(targetingRule: targetingRule)
        }
    }
    
    @objc
    func isActiveTargetingRuleAvailable() -> NSNumber{
        print("iAdvize iOS SDK - isActiveTargetingRuleAvailable called")
        return IAdvizeSDK.shared.targetingController.isActiveTargetingRuleAvailable as NSNumber
    }
    
    @objc
    func setOnActiveTargetingRuleAvailabilityListener() -> Void {
        DispatchQueueHelpers.runOnMainThread {
            print("iAdvize iOS SDK - setOnActiveTargetingRuleAvailabilityListener called")
            IAdvizeSDK.shared.targetingController.delegate = self
        }
    }
    
    @objc(registerUserNavigation:uuid:channel:)
    func registerUserNavigation(navigationOption: String, uuid: String, channel: String) -> Void {
        DispatchQueueHelpers.runOnMainThread {
            print("iAdvize iOS SDK - registerUserNavigation called")
            let navOption = NavigationOption.fromString(navigationOption, uuid: uuid, channel: channel)
            IAdvizeSDK.shared.targetingController.registerUserNavigation(navigationOption: navOption)
        }
    }
    
    //MARK: Conversation
    
    @objc
    func ongoingConversationId() -> String? {
        print("iAdvize iOS SDK - ongoingConversationId called")
        return IAdvizeSDK.shared.conversationController.ongoingConversation()?.conversationId.uuidString
    }

    @objc
    func ongoingConversationChannel() -> String? {
        print("iAdvize iOS SDK - ongoingConversationChannel called")
        return IAdvizeSDK.shared.conversationController.ongoingConversation()?.conversationChannel.rawValue
    }
    
    @objc
    func setConversationListener() -> Void {
        DispatchQueueHelpers.runOnMainThread {
            print("iAdvize iOS SDK - setConversationListener called")
            IAdvizeSDK.shared.conversationController.delegate = self
        }
    }
    
    //MARK: Push notifications
    
    @objc(registerPushToken:applicationMode:)
    func registerPushToken(pushToken: String, mode: String) -> Void {
        let applicationMode = self.applicationModeFrom(value: mode)
        IAdvizeSDK.shared.notificationController.registerPushToken(pushToken, applicationMode: applicationMode)
    }
    
    func applicationModeFrom(value: String) -> ApplicationMode{
        switch value {
        case "dev": return .dev
        case "prod": return .prod
        default: return .dev
        }
    }
    
    @objc(enablePushNotifications:withRejecter:)
    func enablePushNotifications(resolve:@escaping RCTPromiseResolveBlock,
                                 reject:@escaping RCTPromiseRejectBlock) -> Void {
        IAdvizeSDK.shared.notificationController.enablePushNotifications { success in
            if success {
                resolve(true)
            }else{
                reject("0", "", nil)
            }
        }
    }
    
    @objc(disablePushNotifications:withRejecter:)
    func disablePushNotifications(resolve:@escaping RCTPromiseResolveBlock,
                                  reject:@escaping RCTPromiseRejectBlock) -> Void {
        IAdvizeSDK.shared.notificationController.disablePushNotifications { success in
            if success {
                resolve(true)
            }else{
                reject("0", "", nil)
            }
        }
    }
    
    //MARK: Chatbox
    
    @objc(setDefaultFloatingButton:)
    func setDefaultFloatingButton(active: Bool) -> Void {
        DispatchQueueHelpers.runOnMainThread {
            IAdvizeSDK.shared.chatboxController.useDefaultFloatingButton = true
        }
    }
    
    @objc(setFloatingButtonPosition:bottomMargin:)
    func setFloatingButtonPosition(leftMargin: NSNumber, bottomMargin: NSNumber) -> Void {
        DispatchQueueHelpers.runOnMainThread {
            IAdvizeSDK.shared.chatboxController.setFloatingButtonPosition(leftMargin: Double(leftMargin), bottomMargin: Double(bottomMargin))
        }
    }
    
    @objc(setChatboxConfiguration:)
    func setChatboxConfiguration(data: [String: Any]) -> Void {
        var configuration = ChatboxConfiguration()
        
        if let value = data["mainColor"] as? String, let color = UIColor.fromString(hex: value){
            print("iAdvize iOS SDK - set ChatboxConfiguration mainColor to \(color)")
            configuration.mainColor = color
        }
        
        if let value = data["navigationBarBackgroundColor"] as? String, let color = UIColor.fromString(hex: value){
            print("iAdvize iOS SDK - set ChatboxConfiguration navigationBarBackgroundColor to \(color)")
            configuration.navigationBarBackgroundColor = color
        }
        
        if let value = data["navigationBarMainColor"] as? String, let color = UIColor.fromString(hex: value){
            print("iAdvize iOS SDK - set ChatboxConfiguration navigationBarMainColor to \(color)")
            configuration.navigationBarMainColor = color
        }
        
        if let value = data["navigationBarTitle"] as? String{
            print("iAdvize iOS SDK - set ChatboxConfiguration navigationBarTitle to \(value)")
            configuration.navigationBarTitle = value
        }
        
        if let fontName = data["fontName"] as? String, let fontSize = data["fontSize"] as? NSNumber{
            print("iAdvize iOS SDK - set ChatboxConfiguration font to \(fontName) \(fontSize)")
            configuration.font = UIFont(name: fontName, size: CGFloat(fontSize))
        }
        
        if let value = data["automaticMessage"] as? String{
            print("iAdvize iOS SDK - set ChatboxConfiguration automaticMessage to \(value)")
            configuration.automaticMessage = value
        }
        
        if let value = data["gdprMessage"] as? String{
            print("iAdvize iOS SDK - set ChatboxConfiguration gdprMessage to \(value)")
            configuration.gdprMessage = value
        }
        
        if let avatarImageName = data["incomingMessageAvatarImageName"] as? String,
           let image = UIImage(named: avatarImageName){
            print("iAdvize iOS SDK - set ChatboxConfiguration incomingMessageAvatarImageName to \(avatarImageName)")
            configuration.incomingMessageAvatar = .image(image: image)
        }
        
        if let avatarUrl = data["incomingMessageAvatarURL"] as? String,
           let url = URL(string: avatarUrl) {
            print("iAdvize iOS SDK - set ChatboxConfiguration incomingMessageAvatarURL to \(avatarUrl)")
            configuration.incomingMessageAvatar = .url(url: url)
        }
        
        DispatchQueueHelpers.runOnMainThread {
            IAdvizeSDK.shared.chatboxController.setupChatbox(configuration: configuration)
        }
    }


    @objc(presentChatbox)
    func presentChatbox() {
        IAdvizeSDK.shared.chatboxController.presentChatbox()
    }

    @objc(dismissChatbox)
    func dismissChatbox() {
        IAdvizeSDK.shared.chatboxController.dismissChatbox()
    }
    
    //MARK: Transaction
    
    @objc(registerTransaction:)
    func registerTransaction(data: [String: Any]) -> Void {
        guard let transactionId = data["transactionId"] as? String,
              let amout = data["amount"] as? Double,
              let currencyValue = data["currency"] as? String,
              let currency = Currency(rawValue: currencyValue) else{
            
            print("iAdvize SDK - missing parameters")
            return
        }
        let transaction = Transaction(externalTransactionId: transactionId, date: Date(), amount: amout, currency: currency)
        IAdvizeSDK.shared.transactionController.registerTransaction(transaction)
    }
    
    //MARK: Logout
    
    @objc
    func logout() -> Void {
        print("iAdvize iOS SDK - logout called")
        DispatchQueueHelpers.runOnMainThread {
            IAdvizeSDK.shared.logout()
        }
    }
}

extension Iadvize: TargetingControllerDelegate {
    func activeTargetingRuleAvailabilityDidUpdate(isActiveTargetingRuleAvailable: Bool) {
        sendEvent(withName: "iadvize_activeTargetingRuleAvailabilityUpdated", body: ["isActiveTargetingRuleAvailable": isActiveTargetingRuleAvailable])
        print("iAdvize iOS SDK - activeTargetingRuleAvailabilityDidUpdate called")
    }
}

extension Iadvize: ConversationControllerDelegate {
    func ongoingConversationUpdated(ongoingConversation: IAdvizeConversationSDK.OngoingConversation?) {
        sendEvent(withName: "iadvize_onOngoingConversationStatusChanged", body: ["hasOngoingConversation": ongoingConversation != nil])
        print("iAdvize iOS SDK - ongoingConversationStatusDidChange called")
    }

    func didReceiveNewMessage(content: String) {
        sendEvent(withName: "iadvize_onNewMessageReceived", body: ["content": content])
        print("iAdvize iOS SDK - didReceiveNewMessage called")
    }

    func conversationController(_ controller: ConversationController, shouldOpen url: URL) -> Bool {
        sendEvent(withName: "iadvize_handleClickedUrl", body: ["uri": url.absoluteString])
        print("iAdvize iOS SDK - handleClickedUrl called")
        return true
    }
}
