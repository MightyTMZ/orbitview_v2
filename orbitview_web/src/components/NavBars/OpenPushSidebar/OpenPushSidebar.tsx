"use client"

import React from "react";
import "./OpenPushSidebar.css"

const OpenPushSidebar = () => {
  function openNav() {
    const sidenav = document.getElementById("orbitview-open-side-nav");

    if (sidenav) {
      sidenav.style.width = "250px";
    }

    const mainContent = document.getElementById("main");

    if (mainContent) {
      mainContent.style.marginLeft = "250px";
    }
  }

  function closeNav() {
    const sidenav = document.getElementById("orbitview-open-side-nav");

    if (sidenav) {
      sidenav.style.width = "0";
    }

    const mainContent = document.getElementById("main");

    if (mainContent) {
      mainContent.style.marginLeft = "0";
    }
  }
  return (
    <>
      <div id="orbitview-open-side-nav" className="orbitview-openpushsidenav">
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav} style={{ color: "white" }}>
          &times;
        </a>
        <a className="orbitview-nav-link" href="#">About</a>
        <a className="orbitview-nav-link" href="#">Services</a>
        <a className="orbitview-nav-link" href="#">Clients</a>
        <a className="orbitview-nav-link" href="#">Contact</a>
      </div>

      <div id="main">
      </div>
    </>
  );
};

export default OpenPushSidebar;
