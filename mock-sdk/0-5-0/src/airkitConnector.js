import { createConnector } from "@wagmi/core";
import AirService from "./airService.js";

export const airConnector = ({ partnerId }) => createConnector((config) => {
    let airService = new AirService({ partnerId });
    let provider = null;

    return {
        id: "airkit",
        name: "AirKit",
        type: "airkit",
        ready: true,

        async connect() {
            await airService.init();
            await airService.login({});
            provider = await airService.getProvider();
            const accounts = await provider.request({ method: "eth_accounts" });

            return { accounts, chainId: 1 };
        },

        async disconnect() {
            await airService.logout();
        },

        async getProvider() {
            if (!provider) {
                provider = await airService.getProvider();
            }
            return provider;
        },

        async getAccounts() {
            if (!provider) return [];
            return await provider.request({ method: "eth_accounts" });
        },

        async getChainId() {
            return 1; // Ethereum Mainnet
        },

        async isAuthorized() {
            return !!airService.user;
        },

        async switchChain() {
            console.warn("[AirConnector] switchChain() is not supported yet.");
            throw new Error("Switch Chain is not supported.");
        },

        async addChain() {
            console.warn("[AirConnector] addChain() is not supported yet.");
            throw new Error("Add Chain is not supported.");
        },

        async signTypedMessage() {
            console.warn("[AirConnector] signTypedMessage() is not supported yet.");
            throw new Error("Sign Typed Message is not supported.");
        },
    };
});
