import axios from "axios";
import { backendServer } from "@/importantLinks";

const API = axios.create({
  baseURL: backendServer, // Replace with your backend's base URL
  withCredentials: true,
});

export const api = API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // Assume the JWT token is stored in localStorage
  const csrfToken = fetchCsrfToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  return config;
});

export const fetchCsrfToken = async () => {
  try {
    const response = await fetch(`${backendServer}/csrf-token/`, {
      method: "GET",
    });

    const data = await response.json();
    const csrfToken = data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};
