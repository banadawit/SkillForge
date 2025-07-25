// src/utils/auth.js
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Make sure you have installed: npm install jwt-decode
import { toast } from "react-toastify"; // Make sure react-toastify is configured in your App.js/index.js

// --- Configuration ---
const AUTH_TOKEN_KEY = "authTokens"; // Key for storing tokens (access & refresh) in localStorage
const API_BASE_URL = "http://localhost:8000/api"; // Your Django API base URL

// --- Axios Instance with Interceptors ---
// This 'api' instance will be used for all authenticated requests.
// It automatically attaches the JWT and handles token refreshing.
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach access token to outgoing requests
api.interceptors.request.use(
  async (config) => {
    const tokens = getAuthTokens(); // Get current tokens from localStorage
    const user = getUser(); // Get decoded user info (also checks access token expiry)

    // If tokens exist and it's an authenticated request
    if (tokens && tokens.access) {
      // If the access token is still valid, just attach it
      if (user) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
      } else {
        // Access token is expired, try to refresh it
        console.log("Access token expired. Attempting to refresh...");
        const refreshed = await refreshAuthTokens(); // Attempt to get new tokens
        if (refreshed) {
          // If refresh was successful, get the newly updated tokens and attach the new access token
          const newTokens = getAuthTokens();
          config.headers.Authorization = `Bearer ${newTokens.access}`;
          console.log("Token refreshed and attached to request.");
        } else {
          // If refresh failed, reject the request. The response interceptor will then handle logout.
          console.error("Token refresh failed in request interceptor.");
          return Promise.reject(new Error("Token refresh failed."));
        }
      }
    }
    return config; // Continue with the request
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

// Response Interceptor: Handle 401 (Unauthorized) errors for token expiration
api.interceptors.response.use(
  (response) => {
    return response; // Return successful responses directly
  },
  async (error) => {
    const originalRequest = error.config; // Get the original request configuration

    // Check if the error is a 401 Unauthorized AND it's not a retry AND it's not the refresh endpoint itself
    // This prevents infinite loops if refresh token is also bad.
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/token/refresh/"
    ) {
      originalRequest._retry = true; // Mark this request as a retry attempt

      console.warn(
        "401 Unauthorized. Attempting token refresh and retrying original request."
      );
      const refreshed = await refreshAuthTokens(); // Try to refresh the token

      if (refreshed) {
        // If refresh successful, get the new tokens and retry the original request
        const newTokens = getAuthTokens();
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
        return api(originalRequest); // Re-send the original request with the new token
      } else {
        // If refresh failed, clear all tokens and inform the user to log in again
        console.error(
          "Token refresh failed in response interceptor. Logging out user."
        );
        toast.error("Your session has expired. Please log in again.");
        clearAuthTokens(); // Clear all tokens
        // Note: Navigation to login page should ideally be handled by the component
        // that catches this rejected promise, or a global AuthContext listener.
        return Promise.reject(error); // Reject to propagate the error to the component
      }
    }
    // For other errors (non-401, or 401 on refresh endpoint, or already retried 401), just reject
    return Promise.reject(error);
  }
);

// --- Token and User Management Functions ---

/**
 * Retrieves authentication tokens (access and refresh) from localStorage.
 * @returns {Object|null} An object containing 'access' and 'refresh' tokens, or null if not found.
 */
export const getAuthTokens = () => {
  const tokensString = localStorage.getItem(AUTH_TOKEN_KEY);
  return tokensString ? JSON.parse(tokensString) : null;
};

/**
 * Stores authentication tokens (access and refresh) in localStorage.
 * @param {Object} tokens - An object containing 'access' and 'refresh' tokens.
 */
export const setAuthTokens = (tokens) => {
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokens));
};

/**
 * Clears all authentication tokens from localStorage.
 */
export const clearAuthTokens = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Decodes the access token to get user information and checks its expiration.
 * Assumes your CustomTokenObtainPairSerializer adds 'username', 'email', 'user_id', 'is_mentor'.
 * @returns {Object|null} Decoded user payload, or null if token is missing, invalid, or expired.
 */
export const getUser = () => {
  const tokens = getAuthTokens();
  if (!tokens || !tokens.access) {
    return null; // No tokens or no access token
  }
  try {
    const decoded = jwtDecode(tokens.access); // Decode the access token
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check if the token has expired
    if (decoded.exp < currentTime) {
      console.warn("Access token expired based on 'exp' claim.");
      return null; // Token is expired, treat as not logged in
    }
    return decoded; // Return the valid, decoded payload
  } catch (error) {
    console.error("Failed to decode access token or token is invalid:", error);
    return null; // Invalid token format or other decoding error
  }
};

/**
 * Checks if the current user is a mentor based on the 'is_mentor' claim in the decoded JWT.
 * @returns {boolean} True if the user is a mentor, false otherwise.
 */
export const isMentor = () => {
  const user = getUser(); // Get the decoded user payload
  return user ? user.is_mentor : false; // Check the 'is_mentor' claim
};

/**
 * Attempts to log in a user by sending credentials to the backend.
 * Stores the received access and refresh tokens.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<Object|null>} A promise that resolves to the decoded user payload on success, or null on failure.
 */
export const loginUser = async (username, password) => {
  try {
    // Use plain axios for the initial login request, as no token is attached yet
    const response = await axios.post(`${API_BASE_URL}/login/`, {
      username,
      password,
    });

    // Backend should return { access: "...", refresh: "..." }
    if (response.data.access && response.data.refresh) {
      setAuthTokens(response.data); // Store both access and refresh tokens
      const user = getUser(); // Decode the new access token to get user info
      toast.success(`Welcome, ${user?.username || username}!`); // Show success toast
      return user; // Return the decoded user object
    } else {
      toast.error("Invalid token response from server during login.");
      return null; // Response didn't contain expected tokens
    }
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    // Extract and display specific error message from backend if available
    const errorMessage =
      error.response?.data?.detail ||
      error.message ||
      "An unexpected error occurred during login.";
    toast.error(errorMessage);
    return null; // Login failed
  }
};

/**
 * Logs out the user by clearing tokens from localStorage.
 * Navigation to the login page is typically handled by the component that calls this.
 */
export const logoutUser = () => {
  clearAuthTokens(); // Clear tokens
  toast.info("You have been logged out."); // Inform user
};

/**
 * Attempts to refresh the access token using the stored refresh token.
 * This is primarily an internal utility function used by the Axios interceptor.
 * @returns {Promise<boolean>} True if refresh was successful, false otherwise.
 */
export const refreshAuthTokens = async () => {
  const tokens = getAuthTokens();
  if (!tokens || !tokens.refresh) {
    console.warn(
      "No refresh token available for refresh attempt. Cannot refresh."
    );
    clearAuthTokens(); // Clear any partial tokens if refresh token is missing
    return false;
  }

  try {
    // Use plain axios for the refresh request, as it doesn't need an access token
    const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
      refresh: tokens.refresh,
    });

    // If a new access token is received
    if (response.data.access) {
      // Update tokens. The backend might also send a new refresh token,
      // so prioritize that, otherwise keep the old one.
      setAuthTokens({
        access: response.data.access,
        refresh: response.data.refresh || tokens.refresh,
      });
      console.log("Tokens refreshed successfully.");
      return true; // Refresh successful
    } else {
      console.error("Refresh token response missing new access token.");
      clearAuthTokens(); // Malformed response, clear tokens
      return false;
    }
  } catch (error) {
    console.error(
      "Error during token refresh:",
      error.response?.data || error.message
    );
    // If refresh fails (e.g., refresh token is invalid or expired), clear all tokens
    clearAuthTokens();
    return false; // Refresh failed
  }
};
