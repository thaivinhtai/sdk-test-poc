import { test, expect } from "@playwright/test";
// @ts-ignore
import path from "path";
import { exec, spawn } from "child_process";

test.describe("Format Test: UMD (airkit.umd.min.js)", () => {
    test("should load UMD module in Node.js", async () => {
        const umdPath = path.resolve(__dirname, "../../../../mock-sdk/0-6-0/dist/airkit.umd.min.js");

        const script = `
      const AirService = require("${umdPath}").default;
      const service = new AirService({ partnerId: "test-partner" });
      service.init().then(() => console.log("UMD Init Success"));
    `;

        await new Promise<void>((resolve, reject) => {
            exec(`node -e '${script}'`, (error, stdout, stderr) => {
                if (error) return reject(error);
                expect(stdout).toContain("UMD Init Success");
                resolve();
            });
        });
    });

    test("should load UMD module in browser", async ( { page} ) => {

        await page.goto('file:///' + path.resolve(__dirname, "../../../resource/0-6-0/html/index.html"));
        const isAirServiceDefined = await page.evaluate(() => {
            // @ts-ignore
            return typeof window.AirService !== "undefined";
        });
    });
});
