import { test, expect } from "@playwright/test";

test.describe("Unit Test: AirService SDK v0.5.0", async () => {

    const AirService = require('../../../../mock-sdk/0-5-0/src/airService').default;
    let service;

    test.beforeEach(() => {
        service = new AirService({ partnerId: "test-partner" });
    });

    test("should initialize AirService", async () => {
        await service.init();
        expect(service.user).toBeNull();
    });

    test("should login with JWT", async () => {
        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        const user = await service.login({ authToken: token });
        expect(user.partnerId).toBe("test-partner");
    });

    test("should throw error for invalid JWT", async () => {
        await expect(service.login({ authToken: "invalid-token" }))
            .rejects.toThrow("Invalid JWT token");
    });

    test("should get user info after login", async () => {
        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        await service.login({ authToken: token });
        const userInfo = await service.getUserInfo();
        expect(userInfo.partnerId).toBe("test-partner");
    });

    test("should get partner-specific user info", async () => {
        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        await service.login({ authToken: token });
        const partnerInfo = await service.getPartnerUserInfo();
        expect(partnerInfo.partnerData).toBe("Sample partner info");
    });

    test("should throw error for getProvider (not ready in 0.5.0)", async () => {
        await expect(service.getProvider()).rejects.toThrow("Feature not available in this version.");
    });

    test("should logout user", async () => {
        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        await service.login({ authToken: token });
        await service.logout();
        expect(service.user).toBeNull();
    });

    test("should clear initialization", async () => {
        await service.init();
        service.clearInit();
        expect(service.user).toBeNull();
    });

    test("should emit events correctly", async () => {
        let eventCalled = false;
        service.on("logged_in", () => { eventCalled = true; });

        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        await service.login({ authToken: token });
        expect(eventCalled).toBe(true);
    });

    test("should remove event listeners with off()", async () => {
        let eventCalled = false;
        const callback = () => { eventCalled = true; };

        service.on("logged_in", callback);
        service.off("logged_in", callback);

        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        await service.login({ authToken: token });
        expect(eventCalled).toBe(false);
    });
});
