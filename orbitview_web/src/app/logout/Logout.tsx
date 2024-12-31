"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice"; // Make sure this path is correct
import { useRouter } from "next/navigation";

const Logout = () => {
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(5); // Initialize countdown with 5 seconds
  const router = useRouter();

  useEffect(() => {
    dispatch(logout()); // Dispatch logout when the component mounts
    localStorage.removeItem("accessToken"); // clear
    localStorage.removeItem("refreshToken"); // clear

    // Countdown logic
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect after countdown reaches 0
    if (countdown === 0) {
      clearInterval(timer); // Clear the timer when countdown reaches 0
      router.push("/"); // Redirect to home feed or login page
    }

    return () => clearInterval(timer); // Clean up the timer when the component unmounts
  }, [dispatch, countdown, router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: 60 }}>
        You are now logged out! Redirecting you to home feed in {countdown}{" "}
        seconds...
      </h1>
    </div>
  );
};

export default Logout;
