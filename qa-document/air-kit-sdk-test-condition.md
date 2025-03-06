# Test Conditions for AIR Kit SDK - Web

## 1. Installation Test Conditions

### 1.1 NPM Installation
- Verify that the SDK installs successfully with a **valid access token**.
- Confirm that installation fails when using an **invalid** or **expired access token**.
- Ensure installation is blocked when the access token is **missing**.

### 1.2 .npmrc Configuration
- Validate that correct `.npmrc` configuration enables seamless SDK installation.
- Verify that incorrect `.npmrc` configurations result in installation failures with appropriate error messages.

## 2. Bundling Test Conditions

### 2.1 Module Formats
- Ensure that the ESM build (`dist/airkit.esm.js`) works correctly.
- Verify that the CommonJS build (`dist/airkit.cjs.js`) functions as expected.
- Confirm that the UMD build (`dist/airkit.umd.min.js`) is correctly loaded and functions in a browser environment.

### 2.2 Environment Compatibility
- Ensure SDK compatibility with **Node.js runtime**.
- Validate SDK behavior across **different browsers** (Chrome, Firefox, Safari, Edge).

## 3. Dynamic Import Test Conditions

### 3.1 Polyfill Requirements
- Confirm that the SDK prompts for necessary polyfills (`buffer`, `process`) if they are missing.

### 3.2 Webpack Integration
- Verify that integrating `node-polyfill-webpack-plugin` resolves missing dependencies.
- Validate that the provided Webpack configuration executes without errors.

## 4. Usage Test Conditions

### 4.1 AirService Initialization
- Verify that calling `AirService.init()` initializes the SDK without errors.
- Ensure that incorrect configurations result in meaningful error messages.

### 4.2 User Authentication
- Confirm that calling `login()` opens the **default login dialog**.
- Validate that login with a **signed JWT token** functions correctly.
- Ensure that users providing an **email** receive a verification OTP.

### 4.3 User Information Retrieval
- Verify that `getUserInfo()` returns the expected user details.

### 4.4 Provider Functionality
- Confirm that `getProvider()` returns a compatible **Eip1193Provider**.
- Ensure that `preloadWallet()` correctly loads the wallet in the background.

### 4.5 Air ID Management
- Verify that calling `claimAirId()` initiates the Air ID minting process.
- Ensure that `deploySmartAccount()` correctly deploys an Account Abstraction (AA).

### 4.6 Session Management
- Confirm that `logout()` successfully logs out the user and clears session data.
- Validate that `clearInit()` resets the AirService instance.

### 4.7 Event Handling
- Verify that `on()` subscribes to service state updates.
- Ensure that calling `off()` successfully unsubscribes from events.

## 5. Minting Test Conditions

### 5.1 Eligibility Verification
- Ensure minting succeeds for **eligible users**.
- Validate that users with `eligibility = none` cannot mint Air IDs.
- Confirm that reserved names cannot be minted.

### 5.2 Reserved Names Check
- Ensure that profanity filtering prevents inappropriate name selection.
- Verify that the partner-reserved name list is enforced.

## 6. Blockchain Interaction Test Conditions

### 6.1 Provider Compatibility
- Verify that the provider is fully compatible with **web3.js, ethers.js, and Viem**.

### 6.2 Smart Contract Interaction
- Ensure ERC-20 contract interactions (`balanceOf`, `symbol`, `mint`) work correctly.

### 6.3 Account Types
- Validate that **Smart Accounts (AA)** function correctly.
- Confirm that **Signer Accounts (EOA)** can sign transactions and control smart accounts.

## 7. Customization Test Conditions

### 7.1 Theming
- Verify that applying **custom themes** updates the SDK UI accordingly.

### 7.2 Localization
- Ensure that the SDK dynamically applies **language settings** based on the browser locale.
- Validate the **fallback mechanism** when the user's language is not available.

### 7.3 Login Methods
- Confirm that enabling/disabling login methods (`passwordless`, `google`, `wallet`, `passkey`) functions correctly.

## 8. Security Test Conditions

### 8.1 Data Protection
- Ensure that **sensitive user data** (e.g., keys, tokens) is not exposed.
- Validate that all **secure storage mechanisms** are properly implemented.

### 8.2 Authentication Security
- Verify that **JWT validation** follows best security practices.
- Confirm that session expiration and **token renewal** function correctly.

## 9. Performance Test Conditions

### 9.1 Load Handling
- Measure SDK response times under **normal** and **high-load** conditions.
- Identify potential **bottlenecks** in concurrent API calls.

### 9.2 Memory Management
- Verify that prolonged SDK usage does not cause **memory leaks**.

## 10. Compliance & Compatibility Test Conditions

### 10.1 Browser Compatibility
- Validate SDK functionality across **Chrome, Firefox, Safari, and Edge**.

### 10.2 Node.js Compatibility
- Ensure SDK compatibility across **multiple Node.js versions**.

### 10.3 API Backward Compatibility
- Confirm that **new SDK versions** do not break compatibility with previous API versions.
