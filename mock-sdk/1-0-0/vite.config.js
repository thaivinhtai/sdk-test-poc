import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.js"),
            name: "AirService",
            formats: ["es", "cjs", "umd"],
            fileName: (format) => {
                if (format === "es") return "airkit.esm.js";
                if (format === "cjs") return "airkit.cjs.js";
                if (format === "umd") return "airkit.umd.min.js";
            }
        },
        rollupOptions: {
            external: [],
            output: {
                exports: "named"
            }
        },
        minify: "terser"
    }
});
