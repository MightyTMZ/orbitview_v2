"use client"

import React, { useState, useEffect } from "react";
import BottomNavBar from "./NavBars/BottomNavBar/BottomNavBar";
import TopNavBar from "./NavBars/TopNavBar/TopNavBar";
import OpenPushSidebar from "./NavBars/OpenPushSidebar/OpenPushSidebar";
import ResponsiveSideBar from "./NavBars/ResponsiveSidebar/ResponsiveSideBar";

const Navbar = () => {
  // State to store the navbar preference
  const [navBarPreference, setNavBarPreference] = useState("top"); // Default to 'top'

  useEffect(() => {
    // Get the preference from local storage only on client side
    const storedPreference = localStorage.getItem("navbarPreference");
    if (storedPreference) {
      setNavBarPreference(storedPreference);
    }
  }, []); // This effect runs only once when the component mounts

  // Conditional rendering based on the navbar preference
  switch (navBarPreference) {
    case "top":
      return <TopNavBar />;
    case "responsive side bar":
      return <ResponsiveSideBar />;
    case "open push side bar":
      return <OpenPushSidebar />;
    case "bottom":
      return <BottomNavBar />;
    default:
      return <TopNavBar />;
  }
};

export default Navbar;
