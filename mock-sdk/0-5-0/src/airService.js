import { EventBus } from "./utils/eventBus.js";
import { SignJWT, jwtVerify, importJWK } from "jose";

const SECRET_KEY_JWK = {
    kty: "oct",
    k: "mock-secret"
};

export const EMBED_BUILD_ENV = "0.5.0";

class AirService {
    constructor({ partnerId } = {}) {
        if (!partnerId) throw new Error("partnerId is required");
        this.partnerId = partnerId;
        this.user = null;
        this.eventBus = new EventBus();
    }

    async init() {
        console.log("[AirService] Initialized.");
        this.eventBus.emit("initialized");
    }

    /**
     * ✅ Login with JWT or UI prompt
     */
    async login({ authToken } = {}) {
        if (authToken) {
            try {
                const secretKey = await importJWK(SECRET_KEY_JWK, "HS256");
                const { payload } = await jwtVerify(authToken, secretKey);
                this.user = payload;
                console.log("[AirService] User authenticated:", this.user);
                this.eventBus.emit("logged_in", this.user);
                return this.user;
            } catch (error) {
                throw new Error("Invalid JWT token");
            }
        } else {
            return new Promise((resolve) => {
                import("./ui/loginDialog.js").then((dialog) => {
                    dialog.showLogin((email) => {
                        this.user = { email, partnerId: this.partnerId };
                        this.eventBus.emit("logged_in", this.user);
                        resolve(this.user);
                    });
                });
            });
        }
    }

    /**
     * ✅ Generate JWT for testing
     */
    async generateToken(userData) {
        const secretKey = await importJWK(SECRET_KEY_JWK, "HS256");
        const jwt = await new SignJWT(userData)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(secretKey);
        return String(jwt);
    }

    /**
     * ✅ Retrieve general user information
     */
    async getUserInfo() {
        if (!this.user) throw new Error("User not logged in");
        return this.user;
    }

    /**
     * ✅ Retrieve partner-specific user information
     */
    async getPartnerUserInfo() {
        if (!this.user) throw new Error("User not logged in");
        return {
            ...this.user,
            partnerData: "Sample partner info"
        };
    }

    /**
     * ❌ Returns Eip1193Provider (Not yet ready in 0.5.0)
     */
    async getProvider() {
        console.warn("[AirService] getProvider() is not ready yet in version 0.5.0");
        throw new Error("Feature not available in this version.");
    }

    /**
     * ❌ Preload wallet (Not yet ready in 0.5.0)
     */
    async preloadWallet() {
        console.warn("[AirService] preloadWallet() is not ready yet in version 0.5.0");
        throw new Error("Feature not available in this version.");
    }

    /**
     * ❌ Claim Air ID (Minting) (Not yet ready in 0.5.0)
     */
    async claimAirId() {
        console.warn("[AirService] claimAirId() is not ready yet in version 0.5.0");
        throw new Error("Feature not available in this version.");
    }

    /**
     * ✅ Logout the user
     */
    async logout() {
        console.log("[AirService] Logging out...");
        this.user = null;
        this.eventBus.emit("logged_out");
    }

    /**
     * ✅ Clear initialization state
     */
    clearInit() {
        console.log("[AirService] Clearing initialization...");
        this.user = null;
    }

    /**
     * ✅ Subscribe to service events
     */
    on(event, callback) {
        this.eventBus.on(event, callback);
    }

    /**
     * ✅ Unsubscribe from service events
     */
    off(event, callback) {
        this.eventBus.off(event, callback);
    }
}

export default AirService;
