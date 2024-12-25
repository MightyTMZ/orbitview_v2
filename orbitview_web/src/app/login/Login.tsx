"use client";

import { useState, useEffect, FormEvent } from "react";
import { backendServer } from "@/components/importantLinks";

export default function Login() {
  const [username_or_email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [save_info, setSaveInfo] = useState(false); // always assume they dont want their login information saved
  const [error, setError] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);


  if (error) {
    // ghost reference
  }

  // const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    console.log("The user wants their login information saved: " + save_info);
  }, [save_info]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${backendServer}/auth/token/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username_or_email, password, save_info }),
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

      console.log("Access Token: " + data.access);
      console.log("Refresh Token: " + data.refresh);

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
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username or email"
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
              value={username_or_email}
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
          <div className="mb-4">
            <label
              htmlFor="save_info"
              className="text-sm font-medium text-gray-700"
            >
              Save login information?
            </label>
            <input
              type="checkbox"
              id="save_info"
              className="ml-2"
              onChange={(e) => {
                setSaveInfo(e.target.checked); // actually did not know about this property of a checkbox input
              }}
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
