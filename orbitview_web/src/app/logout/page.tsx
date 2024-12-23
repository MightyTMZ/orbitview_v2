"use client";

import React from "react";

const page = () => {
  localStorage.setItem("isAuthenticated", "false");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ fontSize: 60 }}>You are now logged out! Please get off OrbitView and rejoin the Team's meeting</h1>
    </div>
  );
};

export default page;
