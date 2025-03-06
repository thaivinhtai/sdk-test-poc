# QA Challenge - How to Test AIR Kit SDK

## Overview

This project includes a mock SDK and automation tests to demonstrate my approach to testing the AIR Kit SDK. 
The goal is to showcase the feasibility of implementing automation testing at different test levels for the SDK. 
Due to time constraints, this implementation is kept at a basic level and is only locally runnable. 
The code structure and design are not fully optimized, meaning that repetitive code has not been refactored, 
and utility libraries for reusable test components have not been structured properly.

## Project Structure

- **mock-sdk/** - Contains a simple mock implementation of the SDK to simulate real SDK behavior.
- **tests-framework/** - Automation test stuff.
- **qa-document/** - Including framework document, test plan, tess approach,....

## QA Document

- [Test Approach](./qa-document/test-approach.md)
- [Test Framework](./qa-document/automation-test-framework.md)
- [Web SDK Test conditions](./qa-document/air-kit-sdk-test-condition.md)
- [Flutter SDK Test conditions](./qa-document/air-kit-flutter-test-conditions.md)

## Prerequisites

- Node.js 
- Docker

## How to Run the Tests

1. Clone the repository:
   ```sh
   git clone https://github.com/thaivinhtai/sdk-test-poc.git
   ```
2. Go to test-framework folder:
   ```sh
   cd sdk-test-poc/test-framework
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Run tests:
   ```sh
   npx playright test
   ```

## Future Improvements

- Refactor code to eliminate redundancies.
- Structure reusable libraries for better maintainability.
- Implement CI/CD pipelines for automated test execution.
- Expand test coverage with more edge cases.

## Limitations

- The current setup only works in a local environment.
- Lacks comprehensive handling of reusable components and configurations.
- Needs further improvements to optimize test execution and maintainability.

## Conclusion

This project serves as an initial exploration of automating tests for the AIR Kit SDK. 
While it is not fully optimized, it provides a starting point for further enhancements 
and improvements in automation testing strategies for the SDK.
