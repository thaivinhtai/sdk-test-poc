export function showLogin(callback) {
    const dialog = document.createElement("div");
    dialog.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 1000;">
            <h3>Login</h3>
            <input type="email" id="email" placeholder="Enter your email" />
            <button id="loginButton">Login</button>
        </div>
    `;
    document.body.appendChild(dialog);

    document.getElementById("loginButton").onclick = () => {
        const email = document.getElementById("email").value;
        document.body.removeChild(dialog);
        callback(email);
    };
}
