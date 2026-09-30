import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
// Load translation files from public/locales
    .use(Backend)

// Detect user's language
.use(LanguageDetector)

// Connect i18next with React
.use(initReactI18next)

// Initialize i18next
.init({
    backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    detection: {
        order: [
            "querystring",
            "cookie",
            "localStorage",
            "sessionStorage",
        ],
    },

    fallbackLng: "en",

    interpolation: {
        escapeValue: false,
    },
});

export default i18n;