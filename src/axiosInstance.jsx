import axios from "axios";
import config from "./config";

let isRefreshing = false;
let failedQueue = [];

// --------------------------------------------------
// Process queued requests
// --------------------------------------------------
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// --------------------------------------------------
// Clear authentication data
// --------------------------------------------------
const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("userCenter");
  localStorage.removeItem("tempToken");
  localStorage.removeItem("userTemp");
};

// --------------------------------------------------
// Redirect to Login
// --------------------------------------------------
const redirectToLogin = () => {
  if (!window.location.hash.includes("#/login")) {
    window.location.hash = "#/login";
  }
};

// --------------------------------------------------
// Axios Instance
// --------------------------------------------------
const axiosInstance = axios.create({
  baseURL: config.baseURL,
  withCredentials: true,
});

// --------------------------------------------------
// Request Interceptor
// --------------------------------------------------
axiosInstance.interceptors.request.use(
  (requestConfig) => {
    // During normal login flow use token.
    // During center-selection flow use tempToken.
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("tempToken");

    if (token) {
      requestConfig.headers = requestConfig.headers || {};
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --------------------------------------------------
// Response Interceptor
// --------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // ------------------------------------------------
    // Safety check
    // ------------------------------------------------
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    // ------------------------------------------------
    // Login request
    // Never refresh token for login
    // ------------------------------------------------
    if (requestUrl === "/auth/login") {
      return Promise.reject(error);
    }

    // ------------------------------------------------
    // Center selection flow
    // ------------------------------------------------
    const tempToken = localStorage.getItem("tempToken");
    const isCenterSelectionRequest =
      requestUrl.includes("/auth/select-center") ||
      requestUrl.includes("/auth/switch-center");

    /*
     * tempToken is intentionally used before the user
     * selects a center.
     *
     * Do NOT start the normal refresh-token flow here.
     */
    if (
      error.response?.status === 401 &&
      tempToken &&
      isCenterSelectionRequest
    ) {
      console.error(
        "Center selection request was unauthorized.",
        error.response?.data,
      );

      return Promise.reject(error);
    }

    // ------------------------------------------------
    // Handle 401 - Token Refresh
    // ------------------------------------------------
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      // ----------------------------------------------
      // Another request is already refreshing token
      // ----------------------------------------------
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        })
          .then((token) => {
            originalRequest.headers =
              originalRequest.headers || {};

            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // ----------------------------------------------
      // Start refresh
      // ----------------------------------------------
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken");

        // --------------------------------------------
        // No refresh token
        // --------------------------------------------
        if (!refreshToken) {
          throw new Error(
            "No refresh token available",
          );
        }

        // --------------------------------------------
        // Refresh Token Request
        // --------------------------------------------
        const response = await axios.post(
          `${config.baseURL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        if (response.data?.success) {
          const newToken =
            response.data.token;

          // ------------------------------------------
          // Save new access token
          // ------------------------------------------
          if (newToken) {
            localStorage.setItem(
              "token",
              newToken,
            );
          }

          // ------------------------------------------
          // Save new refresh token if provided
          // ------------------------------------------
          if (response.data.refreshToken) {
            localStorage.setItem(
              "refreshToken",
              response.data.refreshToken,
            );
          }

          // ------------------------------------------
          // Update original request
          // ------------------------------------------
          originalRequest.headers =
            originalRequest.headers || {};

          originalRequest.headers.Authorization =
            `Bearer ${newToken}`;

          // ------------------------------------------
          // Resolve queued requests
          // ------------------------------------------
          processQueue(
            null,
            newToken,
          );

          // ------------------------------------------
          // Retry original request
          // ------------------------------------------
          return axiosInstance(
            originalRequest,
          );
        }

        throw new Error(
          "Token refresh failed",
        );
      } catch (refreshError) {
        console.error(
          "Token refresh failed:",
          refreshError,
        );

        // ------------------------------------------
        // Reject queued requests
        // ------------------------------------------
        processQueue(
          refreshError,
          null,
        );

        // ------------------------------------------
        // Clear authentication data
        // ------------------------------------------
        clearAuthData();

        // ------------------------------------------
        // Redirect to login
        // ------------------------------------------
        redirectToLogin();

        return Promise.reject(
          refreshError,
        );
      } finally {
        isRefreshing = false;
      }
    }

    // ------------------------------------------------
    // Any remaining 401
    // ------------------------------------------------
    if (
      error.response?.status === 401
    ) {
      clearAuthData();
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;