// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//     plugins: [
//         react(),
//         tailwindcss(),
//     ],

//     server: {
//         proxy: {
//             "/api": {
//                 // target: "http://103.175.190.244",
//                 target: "http://192.168.1.30:5000",
//                 changeOrigin: true,
//                 secure: false,
//             },
//         },
//     },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],

    server: {
        host: "0.0.0.0",
        port: 5173,
        proxy: {
            "/api": {
                target: "http://192.168.1.8:5000",
                //target: "http://103.175.190.244",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});