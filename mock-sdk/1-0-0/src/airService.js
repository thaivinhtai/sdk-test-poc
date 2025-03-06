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
    constructor({ partnerId  } = {}) {
        if (!partnerId) throw new Error("partnerId is required");
        this.partnerId = partnerId;
        this.user = null;
        this.eventBus = new EventBus();
        this.walletLoaded = false;
        this.smartAccountDeployed = false;
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
     * Login using JWT or UI
     */
    async login({ authToken } = {}) {
        if (authToken) {
            try {
                const secretKey = await importJWK(SECRET_KEY_JWK, "HS256");
                const { payload } = await jwtVerify(authToken, secretKey);
                this.user = payload;
                //
                // // Get wallet address from provider
                // const accounts = await this.getProvider().request({ method: "eth_accounts" });
                // this.user.walletAddress = accounts[0];

                console.log("[AirService] User authenticated:", this.user);
                this.eventBus.emit("logged_in", this.user);
                return this.user;
            } catch (error) {
                throw new Error("Invalid JWT token");
            }
        } else {
            return new Promise((resolve) => {
                import("./ui/loginDialog.js").then((dialog) => {
                    dialog.showLogin(async (email) => {
                        this.user = { email, partnerId: this.partnerId };

                        // // Get wallet address from provider
                        // const accounts = await this.getProvider().request({ method: "eth_accounts" });
                        // this.user.walletAddress = accounts[0];

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
     * Check if Smart Account (AA) is deployed
     */
    async isSmartAccountDeployed() {
        return this.smartAccountDeployed;
    }

    /**
     * Deploy Smart Account (AA)
     */
    async deploySmartAccount() {
        if (!this.user) throw new Error("User must be logged in to deploy Smart Account");
        console.log("[AirService] Deploying Smart Account...");
        this.smartAccountDeployed = true;
        this.eventBus.emit("smart_account_deployed");
    }

    /**
     * Claim Air ID (Minting)
     */
    async claimAirId() {
        if (!this.user) throw new Error("User must be logged in to claim Air ID");
        console.log("[AirService] Minting Air ID...");
        this.eventBus.emit("air_id_minting_started");
        await this.preloadWallet();
        this.smartAccountDeployed = true;
        this.eventBus.emit("air_id_minting_completed");
    }

    /**
     * Logout user
     */
    async logout() {
        console.log("[AirService] Logging out...");
        this.user = null;
        this.walletLoaded = false;
        this.smartAccountDeployed = false;
        this.eventBus.emit("logged_out");
    }

    /**
     * Clear initialization
     */
    clearInit() {
        console.log("[AirService] Clearing initialization...");
        this.user = null;
        this.walletLoaded = false;
        this.smartAccountDeployed = false;
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
