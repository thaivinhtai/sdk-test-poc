import { test, expect } from "@playwright/test";

test.describe("Unit Test: AirService SDK v1.0.0", async () => {

    const AirService = require('../../../../mock-sdk/1-0-0/src/airService').default;
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

    test("should return a provider instance", async () => {
        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        await service.login({ authToken: token });
        const provider = await service.getProvider();
        expect(provider).not.toBeNull();
    });

    test("should preload wallet successfully", async () => {
        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        await service.login({ authToken: token });
        await service.preloadWallet();
        expect(service.walletLoaded).toBe(true);
    });

    test("should claim Air ID after login", async () => {
        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        await service.login({ authToken: token });
        await service.claimAirId();
        expect(service.walletLoaded).toBe(true);
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

    test("should check if smart account is not yet deployed", async () => {
        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        await service.login({ authToken: token });
        const isDeployed = await service.isSmartAccountDeployed();
        expect(isDeployed).toBe(false);
    });

    test("should deploy smart account", async () => {
        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        await service.login({ authToken: token });
        await service.deploySmartAccount();
        const isDeployed = await service.isSmartAccountDeployed();
        expect(isDeployed).toBe(true);
    });
});
