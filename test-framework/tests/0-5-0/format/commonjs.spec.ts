import { test, expect } from "@playwright/test";

test.describe("Format Test: CommonJS (airkit.cjs.js)", () => {
    test("should load CommonJS module correctly", async () => {
        const AirService = require("../../../../mock-sdk/0-5-0/dist/airkit.cjs.js").default;
        const service = new AirService({ partnerId: "test-partner" });
        await service.init();
        expect(service.user).toBeNull();
    });

    test("should login using CommonJS build", async () => {
        const AirService = require("../../../../mock-sdk/0-5-0/dist/airkit.cjs.js").default;
        const service = new AirService({ partnerId: "test-partner" });
        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        const user = await service.login({ authToken: token });
        expect(user.partnerId).toBe("test-partner");
    });
});
