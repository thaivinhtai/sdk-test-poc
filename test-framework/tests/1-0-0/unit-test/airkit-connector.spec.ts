import { test, expect } from "@playwright/test";

test.describe("Unit Test: AirkitConnector SDK 1.0.0", () => {
    const airConnector = require('../../../../mock-sdk/1-0-0/src/airkitConnector').airConnector;
    let connector;

    test.beforeEach(() => {
        connector = airConnector({ partnerId: "test-partner" })({});
    });

    test("should initialize Wagmi connector", async () => {
        expect(connector.id).toBe("airkit");
        expect(connector.name).toBe("AirKit");
    });

    test("should return error for switchChain", async () => {
        await expect(connector.switchChain()).rejects.toThrow("Switch Chain is not supported.");
    });

    test("should return error for addChain", async () => {
        await expect(connector.addChain()).rejects.toThrow("Add Chain is not supported.");
    });

    test("should return error for signTypedMessage", async () => {
        await expect(connector.signTypedMessage()).rejects.toThrow("Sign Typed Message is not supported.");
    });
});
