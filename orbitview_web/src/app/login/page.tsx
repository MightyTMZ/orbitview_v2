"use client";

import { useState } from "react";
import { backendServer } from "@/components/importantLinks";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const handleLogin = async (event: any) => {
    event.preventDefault();

    try {
      const response = await fetch(`${backendServer}/auth/jwt/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        setInvalidCredentials(true);
        throw new Error(data.error || "Login failed!");
      }

      // Store JWT token in localStorage
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("isAuthenticated", "true");


      // Redirect to homepage or dashboard
      window.location.href = "/";
    } catch (error: any) {
      console.error("Error during login:", error);
      setError(error.message);
      setInvalidCredentials(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
          {invalidCredentials && (
            <p style={{ color: "red" }}>Invalid credentials</p>
          )}
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
