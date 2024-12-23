"use client";

import React, { useEffect, useState } from "react";
import { backendServer } from "./importantLinks";

const WelcomeCard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Get access token from cookies (better than localStorage for security)
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("No access token found.");
      setLoading(false);
      return;
    }

    // Fetch user data from backend
    const getUserInfo = async () => {
      try {
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
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false); // Stop loading spinner when done
      }
    };

    getUserInfo();
  }, []); // Runs only once when the component is mounted

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {user ? (
        <div>
          <h2 className="text-2xl font-bold">Welcome, {user.first_name}!</h2>
          <p>Username: {user.username}</p>
          {/* Render more user details here */}
        </div>
      ) : (
        <div>No user information available</div>
      )}
    </div>
  );
};

export default WelcomeCard;
