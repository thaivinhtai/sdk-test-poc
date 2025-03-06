import React, { useState } from "react";
import AirService from "mock-air-service-sdk/dist/airkit.esm.js";

const airService = new AirService({ partnerId: "test-partner" });

function Wallet({ user }) {
    const [walletStatus, setWalletStatus] = useState("Wallet not loaded");

    const handlePreloadWallet = async () => {
        try {
            await airService.preloadWallet();
            setWalletStatus("Wallet preloaded successfully");
        } catch (error) {
            setWalletStatus("Wallet preload failed");
        }
    };

    const handleGetProvider = async () => {
        try {
            const provider = await airService.getProvider();
            console.log("EIP-1193 Provider:", provider);
            setWalletStatus("Provider loaded successfully");
        } catch (error) {
            setWalletStatus("Provider load failed");
        }
    };

    const handleClaimAirId = async () => {
        try {
            await airService.claimAirId();
            setWalletStatus("Air ID claimed successfully");
        } catch (error) {
            setWalletStatus("Air ID claim failed");
        }
    };

    return (
        <div>
            <h2>Blockchain Interaction</h2>
            <p>{walletStatus}</p>
            <button onClick={handlePreloadWallet}>Preload Wallet</button>
            <button onClick={handleGetProvider}>Get Provider</button>
            <button onClick={handleClaimAirId}>Claim Air ID</button>
        </div>
    );
}

export default Wallet;
