"use client";

import React, { useState, useEffect } from "react";

const NavBarSettings = () => {
  // State to hold the selected value
  const [setting, setSetting] = useState("");

  // Effect to load the initial setting from local storage when the component mounts
  useEffect(() => {
    const savedSetting = localStorage.getItem("navbarPreference");
    if (savedSetting) {
      setSetting(savedSetting);
    }
  }, []);

  // Function to handle the selection change
  const handleSelectChange = (event) => {
    const newSetting = event.target.value;
    setSetting(newSetting);
    localStorage.setItem("navbarPreference", newSetting); // Update local storage
  };

  return (
    <div>
      <h2>Navbar Settings</h2>
      <label htmlFor="navbar-select">Choose a setting:</label>
      <select id="navbar-select" value={setting} onChange={handleSelectChange}>
        <option value="top">Top</option>
        <option value="bottom">Bottom</option>
        <option value="open push side bar">Open Push</option>
        <option value="responsive side bar">Responsive Side Bar</option>
      </select>
    </div>
  );
};

export default NavBarSettings;
