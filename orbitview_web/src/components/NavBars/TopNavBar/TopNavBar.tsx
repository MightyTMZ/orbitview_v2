import React from "react";
import "./TopNavBar.css";

const TopNavBar = () => {
  return (
    <>
      <div className="orbitview-topnav">
        <a className="orbitview-nav-link" href="#home">
          Home
        </a>
        <a className="orbitview-nav-link" href="#news">
          News
        </a>
        <a className="orbitview-nav-link" href="#contact">
          Contact
        </a>
        <a className="orbitview-nav-link" href="#about">
          About
        </a>
      </div>

      <div style={{ paddingLeft: "16px" }}>
        
      </div>
    </>
  );
};

export default TopNavBar;
