# Test Approach

The testing approach for the AIR Kit SDK is structured as follows:

## Web SDK

1. **Unit Testing**
    - Typically handled by developers, but this may vary based on team agreements.
    - In this POC, I included some unit tests, though they are stored separately from the SDK source code.
    - Cover all functions provided by the SDK.
    - Use Jest or Mocha + Chai for JavaScript testing. (In this case, Playwright is used along with integration and system tests.)
    - Validate SDK behavior across different runtime environments (Node.js and browser).

2. **Integration & System Testing**
    - **Client-Side Rendering (CSR) Apps:** Verify SDK integration in frameworks like React, Vue, and Vanilla JS.
    - **Server-Side Rendering (SSR) Apps:** Ensure SDK functionality in Next.js, Nuxt.js, or NestJS.
    - **Node.js Compatibility Testing:** Confirm SDK stability across multiple Node.js versions. [more...](automation-test-framework.md#testing-sdk-across-different-nodejs-versions)
    - **Tree-Shaking & Bundle Optimization:** Assess SDK bundle size and ensure proper tree-shaking for the ESM format.

3. **Performance & Compatibility Testing**
    - Measure execution time for key SDK functions.
    - Ensure compatibility across multiple browsers, including Chrome, Firefox, Safari, and Edge.

## Flutter Package

1. **Unit Testing**
    - Cover all public API functions of the package.
    - Use `flutter test` and `mockito` for dependency mocking.

2. **Integration Testing**
    - Run tests on both emulators and real devices.
    - Validate package behavior across multiple Android/iOS versions.
    - Ensure correct interaction with external dependencies.

3. **End-to-End Testing**
    - Test the package in a real-world Flutter application.
    - If the SDK integrates with blockchain APIs, verify end-to-end data flow and response handling.

### Additional Considerations

- **Security Testing:** Ensure sensitive data (e.g., private keys, signatures) is not exposed.
- **Documentation & Example Apps:** Provide clear usage guides and sample implementations.
- **CI/CD Integration:** Set up automated pipelines to run tests across different environments.
