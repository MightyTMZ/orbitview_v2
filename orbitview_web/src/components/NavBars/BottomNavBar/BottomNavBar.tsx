import React from "react";
import "./BottomNavBar.css";

const BottomNavBar = () => {
  return (
    <>
      <div className="orbitview-navbar">
        <a className="orbitview-nav-link" href="#home">
          Home
        </a>
        <a className="orbitview-nav-link" href="#news">
          News
        </a>
        <a className="orbitview-nav-link" href="#contact">
          Contact
        </a>
      </div>

      <div className="main"></div>
    </>
  );
};

export default BottomNavBar;
