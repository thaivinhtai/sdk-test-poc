import React, { useState, useEffect } from "react";
import AirService from "mock-air-service-sdk/dist/airkit.esm.js";

const airService = new AirService({ partnerId: "test-partner" });

function Auth({ setUser }) {
    const [status, setStatus] = useState("Not logged in");

    useEffect(() => {
        airService.init().then(() => console.log("SDK Initialized"));
    }, []);

    const handleLogin = async () => {
        try {
            const userData = { email: "user@example.com", partnerId: "test-partner" };
            const token = await airService.generateToken(userData);
            const user = await airService.login({ authToken: token });
            setUser(user);
            setStatus(`Logged in as: ${user.partnerId}`);
        } catch (error) {
            setStatus("Login failed");
        }
    };

    const handleLogout = async () => {
        await airService.logout();
        setUser(null);
        setStatus("Not logged in");
    };

    return (
        <div>
            <h2>Authentication</h2>
            <p>{status}</p>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleLogout} disabled={status === "Not logged in"}>
                Logout
            </button>
        </div>
    );
}

export default Auth;
