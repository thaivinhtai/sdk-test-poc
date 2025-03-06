import { EventBus } from "./utils/eventBus.js";
import { SignJWT, jwtVerify, importJWK } from "jose";

// Mock blockchain provider (EIP-1193)
class MockProvider {
    constructor() {
        this.accounts = ["0xMockUserWallet"];
    }
    request({ method }) {
        if (method === "eth_accounts") {
            return Promise.resolve(this.accounts);
        }
        return Promise.reject(new Error("Unsupported method"));
    }
}

// Secret key for JWT signing (Replace with real key)
const SECRET_KEY_JWK = {
    kty: "oct",
    k: "mock-secret"
};

class AirService {
    constructor({ partnerId } = {}) {
        if (!partnerId) throw new Error("partnerId is required");
        this.partnerId = partnerId;
        this.user = null;
        this.eventBus = new EventBus();
        this.walletLoaded = false;
        this.provider = new MockProvider();
    }

    /**
     * Initialize SDK
     */
    async init() {
        console.log("[AirService] Initialized.");
        this.eventBus.emit("initialized");
    }

    /**
     * Login using JWT or prompt UI
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
     * Generate JWT for authentication
     */
    async generateToken(userData) {
        const secretKey = await importJWK(SECRET_KEY_JWK, "HS256");
        return await new SignJWT(userData)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(secretKey);
    }

    /**
     * Get user information
     */
    async getUserInfo() {
        if (!this.user) throw new Error("User not logged in");
        return this.user;
    }

    /**
     * Get partner-specific user information
     */
    async getPartnerUserInfo() {
        if (!this.user) throw new Error("User not logged in");
        return { ...this.user, partnerData: "Sample partner info" };
    }

    /**
     * Get EIP-1193 provider for blockchain interaction
     */
    async getProvider() {
        console.log("[AirService] Returning EIP-1193 provider...");
        return this.provider;
    }

    /**
     * Preload user wallet
     */
    async preloadWallet() {
        if (!this.user) throw new Error("User must be logged in to preload wallet");
        console.log("[AirService] Preloading wallet...");
        this.walletLoaded = true;
        this.eventBus.emit("wallet_initialized");
    }

    /**
     * Claim Air ID (Minting)
     */
    async claimAirId() {
        if (!this.user) throw new Error("User must be logged in to claim Air ID");
        console.log("[AirService] Minting Air ID...");
        this.eventBus.emit("air_id_minting_started");
        await this.preloadWallet();
        this.eventBus.emit("air_id_minting_completed");
    }

    /**
     * Logout user
     */
    async logout() {
        console.log("[AirService] Logging out...");
        this.user = null;
        this.walletLoaded = false;
        this.eventBus.emit("logged_out");
    }

    /**
     * Clear initialization
     */
    clearInit() {
        console.log("[AirService] Clearing initialization...");
        this.user = null;
        this.walletLoaded = false;
    }

    /**
     * Subscribe to service events
     */
    on(event, callback) {
        this.eventBus.on(event, callback);
    }

    /**
     * Unsubscribe from service events
     */
    off(event, callback) {
        this.eventBus.off(event, callback);
    }
}

export default AirService;
