"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice"; // Make sure this path is correct

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout()); // Dispatch logout when the component mounts
  }, [dispatch]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: 60 }}>
        You are now logged out! Please get off OrbitView and rejoin the Team's
        meeting
      </h1>
    </div>
  );
};

export default Logout;
