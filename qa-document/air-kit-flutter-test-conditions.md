# Test Conditions for AIR Kit SDK - Flutter

## 1. Installation Test Conditions

### 1.1 OnePub CLI Installation
- Verify that `dart pub global activate onepub` installs OnePub CLI successfully.
- Ensure the `onepub login` command correctly authenticates the user with provided credentials.
- Confirm that running `onepub` without adding it to PATH fails with an appropriate error message.
- Validate that adding `$HOME/.pub-cache/bin` to PATH resolves the command not found issue.

### 1.2 SDK Installation
- Verify that adding the SDK manually in `pubspec.yaml` allows successful installation.
- Ensure the SDK is correctly installed using `onepub pub add airkit`.
- Validate that installation fails when the repository URL in `pubspec.yaml` is incorrect.

## 2. Android Configuration Test Conditions

### 2.1 Compile & Min SDK Versions
- Ensure that the application builds successfully with `compileSdkVersion 34` and `minSdk 26`.
- Confirm that an error is raised when the `compileSdkVersion` is below 34.
- Verify that an error occurs when `minSdk` is set lower than 26.

### 2.2 Permissions
- Validate that the app does not crash due to missing `android.permission.INTERNET` in `AndroidManifest.xml`.
- Ensure that adding `<uses-permission android:name="android.permission.INTERNET" />` resolves network connectivity issues.

### 2.3 Deep Linking Configuration
- Verify that adding the correct deep link intent filter to `AndroidManifest.xml` allows redirection.
- Ensure incorrect deep link configurations prevent the app from receiving authentication callbacks.
- Confirm that the final deep link URL is whitelisted correctly on the server.

## 3. iOS Configuration Test Conditions

### 3.1 iOS Platform Version
- Verify that setting `platform :ios, '14.0'` in the `Podfile` allows the project to build successfully.
- Confirm that setting a version lower than `14.0` results in build failures.

### 3.2 Deep Linking Configuration
- Validate that the deep link `{bundleId}://auth` correctly redirects users to the app.
- Ensure the bundle ID is correctly registered on the server for authentication.

## 4. Usage Test Conditions

### 4.1 SDK Initialization
- Verify that calling `AirService.initialize()` initializes the SDK without errors.
- Ensure passing incorrect `partnerId` results in an error.
- Confirm that the `redirectUrl` matches the expected format (`{scheme}://{your_app_package}/auth`).

### 4.2 User Authentication
- Verify that calling `AirService.login(authToken: validToken)` successfully logs in the user.
- Ensure login fails with an incorrect or expired JWT token.
- Validate that users receive an appropriate error when the JWKS endpoint is missing.

### 4.3 User Session Management
- Confirm `AirService.isLoggedIn()` correctly returns the login state.
- Verify that `AirService.logout()` logs out the user and clears session data.

## 5. Compliance & Compatibility Test Conditions

### 5.1 Flutter Version Compatibility
- Ensure the SDK functions correctly on **Flutter stable, beta, and dev channels**.
- Validate behavior on Flutter versions **3.x.x and later**.

### 5.2 Device Compatibility
- Test the SDK on **physical and emulator devices** running Android 12, 13, and iOS 14+.
- Verify that login and wallet interactions work across multiple device types.

### 5.3 API Backward Compatibility
- Ensure future SDK versions maintain compatibility with earlier authentication flows.
- Verify that deprecations do not cause application failures.
