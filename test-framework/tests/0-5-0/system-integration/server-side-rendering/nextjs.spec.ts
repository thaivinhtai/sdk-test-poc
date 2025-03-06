import {test, expect, selectors} from "@playwright/test";
import { spawn, execSync, exec, ChildProcess } from "child_process";
// @ts-ignore
import http from "http";
import {getRandomPort} from "../../../../utils/get-random-port";
// @ts-ignore
import fs from "fs";
// @ts-ignore
import path from "path";

const NODE_VERSIONS = ["18", "20", "22"];
const DAPP_DIR = path.resolve(__dirname, "../../../../resource/0-5-0/DApp/nextjs");
let port;
let containerProcess: ChildProcess;

/**
 * Check if DApp is ready using HTTP request
 */
async function isDAppRunning(url: string, timeout = 30000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        try {
            await new Promise((resolve, reject) => {
                http.get(url, (res) => {
                    if (res.statusCode === 200) {
                        resolve(true);
                    } else {
                        reject(new Error(`DApp response: ${res.statusCode}`));
                    }
                }).on("error", reject);
            });
            console.log(`✅ DApp is running at ${url}`);
            return true;
        } catch (err) {
            console.log("⏳ Waiting for DApp to start...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
    throw new Error("❌ DApp failed to start within timeout!");
}

for (const NODE_VERSION of NODE_VERSIONS) {
    test.describe(`Test DApp with Node.js ${NODE_VERSION}`, () => {
        const CONTAINER_NAME = `mock-sdk-dapp-node${NODE_VERSION}`;
        const IMAGE_NAME = `mock-sdk-dapp:${NODE_VERSION}`;

        test.beforeAll(async () => {
            test.setTimeout(60000);
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
            if (fs.existsSync(`${DAPP_DIR}/.next`)) {
                fs.rmSync(`${DAPP_DIR}/.next`, {
                    recursive: true,
                    force: true,
                });
            }

            port = await getRandomPort();
            console.log(`🚀 Building Docker image for Node.js ${NODE_VERSION}...`);
            execSync(`docker build --build-arg NODE_VERSION=${NODE_VERSION} --build-arg PORT=${port} -t ${IMAGE_NAME} -f Dockerfile .`, {
                stdio: "inherit",
                cwd: DAPP_DIR,
            });

            console.log(`🚀 Starting Docker container for Node.js ${NODE_VERSION}...`);
            containerProcess = spawn("docker", [
                "run", "-d", "--rm",
                "--name", CONTAINER_NAME,
                "-p", `${port}:${port}`,
                "-e", `PORT=${port}`,
                IMAGE_NAME
            ], { stdio: "inherit", cwd: DAPP_DIR });

            await new Promise((resolve) => setTimeout(resolve, 5000));

            await isDAppRunning(`http://localhost:${port}`);
        });

        test.afterAll(async () => {
            console.log(`🛑 Stopping Docker container for Node.js ${NODE_VERSION}...`);
            execSync(`docker stop ${CONTAINER_NAME}`, { stdio: "inherit" });

            console.log(`🗑️ Removing Docker image for Node.js ${NODE_VERSION}...`);
            execSync(`docker rmi $(docker images '${IMAGE_NAME}' -a -q)`, { stdio: "inherit" });

            console.log(`✅ Cleanup completed for Node.js ${NODE_VERSION}`);
        });

        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:${port}`);
        });

        test("should load SSR page", async ({ page }) => {
            const title = await page.textContent("h1");
            expect(title).toBe("Mock SDK SSR DApp");
        });

        test("should login successfully", async ({ page }) => {
            await page.click("button:text('Login')");
            await page.getByPlaceholder('Enter your email').fill('test@foo.bar');
            selectors.setTestIdAttribute('id');
            await page.getByTestId('loginButton').click();
            await expect(page.getByText('Logged in as test@foo.bar')).toBeVisible();
        });

        test("should logout successfully", async ({ page }) => {
            await page.click("button:text('Login')");
            await page.getByPlaceholder('Enter your email').fill('test@foo.bar');
            selectors.setTestIdAttribute('id');
            await page.getByTestId('loginButton').click();
            await page.click("button:text('Logout')");
            const status = await page.textContent("p");
            await expect(page.getByText('Logged in as test@foo.bar')).not.toBeVisible();
        });
    });
}
