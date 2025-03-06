import React, { useState } from "react";
import Auth from "./components/Auth";
import Wallet from "./components/Wallet";

function App() {
    const [user, setUser] = useState(null);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Mock SDK v0.5.0 React App</h1>
            <Auth setUser={setUser} />
            {user && <Wallet user={user} />}
        </div>
    );
}

export default App;
