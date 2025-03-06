import { useState } from "react";
import AirService from "mock-air-service-sdk";

const airService = new AirService({ partnerId: "client-partner" });

export default function Auth() {
    const [user, setUser] = useState(null);

    const handleLogin = async () => {
        const loggedInUser = await airService.login();
        setUser(loggedInUser);
    };

    const handleLogout = async () => {
        await airService.logout();
        setUser(null);
    };

    return (
        <div>
            <h2>Auth</h2>
            {user ? (
                <>
                    <p>Logged in as {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <button onClick={handleLogin}>Login</button>
            )}
        </div>
    );
}
