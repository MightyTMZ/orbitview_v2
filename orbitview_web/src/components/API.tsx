import axios from "axios";
import { backendServer } from "@/importantLinks";

// Create Axios instance with base URL
export const API = axios.create({
  baseURL: backendServer, // Replace with your backend's base URL
  withCredentials: true, // Important for cookie-based auth
});

// Function to fetch and cache CSRF token
export const fetchCsrfToken = async () => {
  try {
    let csrfToken = sessionStorage.getItem("csrfToken");
    if (!csrfToken) {
      const response = await fetch(`${backendServer}/csrf-token/`, {
        method: "GET",
      });
      const data = await response.json();
      csrfToken = data.csrfToken;

      if (csrfToken) {
        sessionStorage.setItem("csrfToken", csrfToken);
      } else {
        console.log(
          "sent the request for a csrf token but could not save it to the session storage"
        );
      }
    }
    return csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    throw new Error("CSRF token fetch failed");
  }
};

// Axios request interceptor
API.interceptors.request.use(
  async (config) => {
    try {
      // Add Authorization token if available
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add CSRF token if available
      const csrfToken = await fetchCsrfToken();
      if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
      }

      return config;
    } catch (error) {
      console.error("Error in Axios request interceptor:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);
