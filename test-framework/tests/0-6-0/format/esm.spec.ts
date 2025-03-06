import { test, expect } from "@playwright/test";

// @ts-ignore
import AirService from "../../../../mock-sdk/0-6-0/dist/airkit.esm.js";

test.describe("Format Test: ESM (airkit.esm.js)", () => {
    test("should initialize AirService from ESM build", async () => {
        const service = new AirService({ partnerId: "test-partner" });
        await service.init();
        expect(service.user).toBeNull();
    });

    test("should login with JWT in ESM build", async () => {
        const service = new AirService({ partnerId: "test-partner" });
        const userData = { email: "user@example.com", partnerId: "test-partner" };
        const token = await service.generateToken(userData);
        const user = await service.login({ authToken: token });
        expect(user.partnerId).toBe("test-partner");
    });
});
