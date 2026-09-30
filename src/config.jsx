import axios from "axios";

axios.defaults.withCredentials = true;

const config = {
  // Vite proxy:
  // Browser -> localhost:5173/api
  // Vite -> http://103.175.190.244/api
  baseURL: "/api",
};

export default config;