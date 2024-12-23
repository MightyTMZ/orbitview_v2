"use client";

import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { backendServer } from "./importantLinks";
import { useEffect, useState } from "react";
import styles from "./TempNavbar.module.css";

const TempNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const renewUserLogin = async () => {
    if (!refreshToken) return; // Skip if refreshToken doesn't exist

    try {
      const response = await fetch(`${backendServer}/auth/jwt/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }), // Ensure the key matches your backend API
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed!");
      }

      // Store JWT token in localStorage
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true); // Update state
    } catch (error: any) {
      console.error("Error during login:", error.message || error);
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
    }
  };

  const getUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`${backendServer}/auth/users/me/`, {
        method: "GET", // Typically, GET is used to fetch user data
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${accessToken}`, // JWT in Authorization header
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to retrieve profile");
      }

      setUser(data); // Store the user data in state
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setError(error);
    }
  };

  useEffect(() => {
    // Check localStorage for authentication status when the component mounts
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(authStatus);

      if (!authStatus) {
        renewUserLogin(); // Attempt to renew login if not authenticated
      }
    }
  }, []);

  console.log(user);

  return (
    <nav
      className={`bg-gray-800 p-4 text-white flex justify-between items-center ${styles.nav}`}
    >
      <Link href="/" className="text-2xl font-bold">
        OrbitView
      </Link>
      <div className="space-x-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/events">Events</Link>
        <Link href="/network">Network</Link>
        <Link href="/learn">Learn</Link>

        {isAuthenticated ? (
          <>
            <FaUserCircle size={30} className="inline-block" />
            <Link href="/logout">Log Out</Link>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default TempNavbar;
