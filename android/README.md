# Mischief Android preview

An offline Android emoji mixer and selectable sticker keyboard, for Android 7.1 (API 25) and newer. Includes the shared Unicode catalog and composition engine, 2–4 ingredients, PNG export, animated GIF export, and original-emoji text fallback. This is a development preview, not a Play Store production release.

Current status: source implementation only. No verified APK is included. The local Windows build stopped with Java `AccessDeniedException` while processing SDK and generated JAR files. Compilation, lint, device installation, and cross-app behavior still need successful verification. The installation steps below apply after an APK has been built.

## Install and use

1. Transfer `Mischief-Android-preview.apk` to your Android phone and open it. Android may ask you to allow installation from the app used to open the APK.
2. Open Mischief and tap **1. Enable keyboard**. Enable **Mischief Emoji Keyboard** in Android settings.
3. Tap **2. Choose keyboard**, or use the keyboard switcher in a text field.
4. Select ingredients and tap **Use PNG** or **Use GIF**. The receiving app must advertise support for that image format. Review the attachment in the receiving app before sending it.
5. If images are unsupported, use **Original emojis**, **Copy PNG**, or open the standalone mixer and share the image as an attachment.
6. Tap **ABC / Switch** to return to your normal typing keyboard. Mischief is an emoji panel, not a complete letter keyboard. Use the standalone mixer for text search; the keyboard offers categories and pages.

Custom mixes are image stickers, not new Unicode characters. They cannot be inserted into every field or converted automatically into another app's proprietary sticker format. GIF playback, transparency, image pasting, and attachment presentation are controlled by the receiving app. APKs do not run on iPhones.

## Build

Use JDK 17, Gradle 8.11.1, Android SDK Platform 35 and Build Tools 35.0.0. Set `ANDROID_HOME` to the SDK directory, then run `gradle assembleDebug lintDebug` in this directory. The build copies the latest shared renderer/catalog from `../../dist` relative to `app/`; it does not require a hosted site or internet at runtime.

Gradle generates a local debug signing key by default. In restricted Windows environments, generate a development key with `keytool` and set `MISCHIEF_DEBUG_KEYSTORE` to its location (alias `androiddebugkey`, development-only password `android`). Never use this public development password for release signing. Keep the generated key out of Git.

The APK is generated at `app/build/outputs/apk/debug/app-debug.apk`. Create a private release key and release configuration before wider distribution. Updates must use the same application ID and signing key. This preview does not silently update itself; automatic updates require a distribution channel such as Google Play and a production signing setup.

## Privacy and content handling

- No Internet, microphone, contacts, storage, or accessibility-service permission.
- No reading of surrounding text, passwords, or conversation history.
- WebView loads bundled assets only; external navigation and network resources are blocked.
- The user explicitly enables the keyboard in Android settings; the app cannot enable itself.
- Password fields redirect the user to their regular keyboard.
- Stickers are temporary files shared using read-only content URIs. Old sticker files are removed after seven days when another sticker is created.
- Exports are cancelled when the input field changes, so a delayed GIF is not inserted into a different conversation.

## Validation boundaries

Compilation, Android lint, APK signature checks, and shared-renderer regression tests are build checks. They do not prove behavior in WhatsApp, Telegram, or every OEM keyboard environment. Real-device testing is required before a production release, including PNG/GIF insertion, switching keyboards, rotation, landscape layout, large text, accessibility, and older emoji-font support.

Official integration reference: https://developer.android.com/develop/ui/views/touch-and-input/image-keyboard
