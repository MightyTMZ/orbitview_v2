import React from "react";
import "./ResponsiveSideBar.css";

const ResponsiveSideBar = () => {
  return (
    <>
      <div className="orbitview-side-bar-container">
        <div className="orbitview-sidebar">
          <a className="orbitview-link" href="#home">
            Home
          </a>
          <a className="orbitview-link" href="#news">
            News
          </a>
          <a className="orbitview-link" href="#contact">
            Contact
          </a>
          <a className="orbitview-link" href="#about">
            About
          </a>
        </div>

        <div className="content">
          
        </div>
      </div>
    </>
  );
};

export default ResponsiveSideBar;
