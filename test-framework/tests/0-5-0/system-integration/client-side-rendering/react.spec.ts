import { test, expect } from "@playwright/test";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
// @ts-ignore
import path from "path";
// @ts-ignore
import fs from "fs";
import {getRandomPort} from "../../../../utils/get-random-port";

const DAPP_DIR = path.resolve(__dirname, "../../../../resource/0-5-0/DApp/react");
let serverProcess: ChildProcessWithoutNullStreams;
let port;

test.beforeAll(async () => {

    if (fs.existsSync(`${DAPP_DIR}/node_modules`)) {
        fs.rmSync(`${DAPP_DIR}/node_modules`, {
            recursive: true,
            force: true,
        });
    }
    if (fs.existsSync(`${DAPP_DIR}/package-lock.json`)) {
        fs.rmSync(`${DAPP_DIR}/package-lock.json`, {
            force: true,
        });
    }

    console.log("🚀 Installing dependencies...");
    const installProcess = spawn("npm", ["install"], {
        cwd: DAPP_DIR,
        env: {
            ...process.env,
            PORT: port,
        }
    });

    await new Promise<void>((resolve, reject) => {
        installProcess.on("close", (code) => {
            if (code === 0) {
                console.log("✅ Dependencies installed.");
                resolve();
            } else {
                reject(new Error("❌ Failed to install dependencies"));
            }
        });
    });

    console.log("🚀 Starting React DApp...");
    port = await getRandomPort();
    serverProcess = spawn("npm", ["start"], {
        cwd: DAPP_DIR,
        env: {
            ...process.env,
            PORT: port,
        },
        stdio: "inherit",
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log(`✅ DApp started at http://localhost:${port}`);
});

test.afterAll(async () => {
    console.log("🛑 Stopping React DApp...");
    serverProcess.kill();
    console.log("DApp stopped.");
    if (fs.existsSync(`${DAPP_DIR}/node_modules`)) {
        fs.rmSync(`${DAPP_DIR}/node_modules`, {
            recursive: true,
            force: true,
        });
    }
    if (fs.existsSync(`${DAPP_DIR}/package-lock.json`)) {
        fs.rmSync(`${DAPP_DIR}/package-lock.json`, {
            force: true,
        });
    }
});

test.describe("End-to-End Test: SDK Integration with DApp", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`http://localhost:${port}`);
    });

    test("should load SDK and show Not logged in status", async ({ page }) => {
        const status = await page.textContent("p");
        expect(status).toBe("Not logged in");
    });

    test("should login successfully", async ({ page }) => {
        await page.click("button:text('Login')");
        const status = await page.textContent("p");
        expect(status).toContain("Logged in as");
    });

    test("should preload wallet", async ({ page }) => {
        await page.click("button:text('Login')");
        await page.click("button:text('Preload Wallet')");
        const walletStatus = await page.textContent("p");
        expect(walletStatus).toBe("Wallet preloaded successfully");
    });

    test("should get provider", async ({ page }) => {
        await page.click("button:text('Login')");
        await page.click("button:text('Get Provider')");
        const walletStatus = await page.textContent("p");
        expect(walletStatus).toBe("Provider loaded successfully");
    });

    test("should claim Air ID", async ({ page }) => {
        await page.click("button:text('Login')");
        await page.click("button:text('Claim Air ID')");
        const walletStatus = await page.textContent("p");
        expect(walletStatus).toBe("Air ID claimed successfully");
    });

    test("should logout successfully", async ({ page }) => {
        await page.click("button:text('Login')");
        await page.click("button:text('Logout')");
        const status = await page.textContent("p");
        expect(status).toBe("Not logged in");
    });
});
