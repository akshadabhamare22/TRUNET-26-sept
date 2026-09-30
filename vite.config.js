import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],

    server: {
        proxy: {
            "/api": {
                target: "http://103.175.190.244",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});