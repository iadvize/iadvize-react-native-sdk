import UIKit
import React_RCTAppDelegate

// The iOS 26 SDK (Xcode 27) makes the UIScene life cycle mandatory: the window is created here and
// React Native started from the scene rather than the app delegate. React Native ships no scene
// support through 0.87, so this adoption is manual and should be re-synced once RN templates it
// upstream. See https://github.com/expo/expo/issues/46664
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene,
          let appDelegate = UIApplication.shared.delegate as? AppDelegate,
          let factory = appDelegate.reactNativeFactory else {
      return
    }

    let window = UIWindow(windowScene: windowScene)
    self.window = window
    // Keep AppDelegate.window pointing at the live window: code that predates scenes still reads it.
    appDelegate.window = window

    factory.startReactNative(
      withModuleName: "example",
      in: window,
      launchOptions: appDelegate.launchOptions
    )
  }
}
