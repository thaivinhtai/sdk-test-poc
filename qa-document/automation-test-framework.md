# Automation Test Framework

## Overview

This is a custom and hybrid test framework designed for testing the Web SDK, which is developed as an npm package. Given this, the test framework should also be built using JavaScript/TypeScript. The choice of a scripting language allows for faster development and easier test case implementation.

The framework is envisioned as a CLI tool with sub-commands and options to manage test cases and their execution flexibly. However, in this submission, this functionality has not yet been implemented, and I am currently utilizing Playwright in its native form.

## Why Playwright?

Playwright is chosen as the primary test runner for the following reasons:
- **UI Mode:** Provides a more interactive way to develop and debug test scripts.
- **Smart Worker Allocation:** Efficient test execution with intelligent worker distribution.
- **High Performance:** Faster execution compared to other frameworks.
- **Custom Fixtures:** Allows extensive customization, enabling unit tests, integration tests, and system integration tests.

## Future Extensions

The framework can be extended to include:
- **Appium and WebdriverIO:** Enabling mobile device automation.
- **Multi-Platform Testing:** Managing and automating test cases across API, Web, Mobile, and even Shell and CLI environments.

## Test Case Management

Test cases should be managed based on versioning, test level, priority, and other necessary properties. For example, a test case might be valid from SDK version `0.5.0` to `0.6.0`. This allows flexible test execution for different SDK versions.

Although this functionality is not yet implemented in this submission, the current approach involves maintaining separate folders for test cases corresponding to each SDK version. While this introduces complexity and redundancy, it ensures basic functionality.

By supporting multiple filtering mechanisms for test cases, the framework will provide flexibility in implementing different test strategies efficiently.

## Current Automation Test Project Structure

The current automation test structure is quite simple and includes:

- **resource/** → Contains test data and simple applications developed using the SDK. These applications ensure coverage of the SDK's critical functions.

- **tests/** → Contains automation test cases.

## Current Test Case Structure

### Overview

The test cases (inside the `tests` folder) are organized as follows:

### **Version-Based Organization**
Test cases are grouped into folders corresponding to each SDK version. This approach ensures that we can maintain and execute test suites for different SDK versions, catering to customers who may use varying versions of the SDK.

### **Test Case Categories**
Within each version folder, test cases are divided into three main categories:

1. **Unit Tests**
    - Focus on testing individual functions of the SDK.
    - SDK functions are directly imported from the source code.
    - Executed in a Node.js environment using the Playwright test runner.

2. **Format Compatibility Tests**
    - Ensures that the SDK works correctly across different module formats (`CommonJS`, `ESM`, and `UMD`).
    - Validates execution in both **Node.js** and **browser** environments.

3. **System Integration Tests**
    - Simple decentralized applications (DApps) are built using common frameworks.
    - Full workflow testing from installing the SDK, deploying an app using the SDK, and validating SDK functionality through the mock DApp.
    - Further divided into:
        - **Client-Side Rendering (CSR)**: Tests the SDK when integrated into client-rendered applications.
        - **Server-Side Rendering (SSR)**: Tests the SDK when integrated into server-rendered applications.
            - Ensures compatibility with different versions of **Node.js** when deploying the DApp.

### **Testing SDK Across Different Node.js Versions**
To validate SDK compatibility with various Node.js versions, we can use **Docker** to create isolated testing environments:

1. **Dockerfile for Each Node.js Version**
    - Create separate `Dockerfile` configurations for each Node.js version.
    - Each image contains the required environment and dependencies for running a test DApp.

   2. **Building Docker Images**
       - Use Docker to build images based on the different `Dockerfile` configurations.
       - Example `Dockerfile`:
       ```sh
       # ARG to input node version
       ARG NODE_VERSION=18
       ARG PORT=3000
       FROM node:${NODE_VERSION}
    
       # Setup working dir
       WORKDIR /app
    
       # Copy all source to container
       COPY . .
    
       # setup dependencies
       RUN npm install
    
       # Build Next.js app
       RUN npm run build
    
       # Start Next.js server on a port
       CMD ["sh", "-c", "PORT=${PORT} npm run start"]
      ```

3. **Starting Containers**
    - Run containers with the appropriate SDK version.
    - Ensure that the deployed DApp is accessible from outside the container.

4. **Testing the Deployed DApps with Playwright**
    - Once the DApps are deployed inside containers, Playwright is used to verify their functionality.
    - Example Playwright test script can be found [here](https://github.com/thaivinhtai/sdk-test-poc/blob/main/test-framework/tests/0-5-0/system-integration/server-side-rendering/nextjs.spec.ts)
    - By leveraging Docker, we can ensure that the SDK functions correctly across multiple Node.js versions in a controlled and reproducible environment.
