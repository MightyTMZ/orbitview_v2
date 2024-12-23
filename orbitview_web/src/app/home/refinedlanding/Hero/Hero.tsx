import React from "react";
// import { ReactTyped } from "react-typed";
import Image from "next/image";
import OrbitViewPrimaryLogo from "../../../../../public/OrbitView_primary.png";
import GoogleLogo from "../../../../../public/google_logo.webp";
import MicrosoftLogo from "../../../../../public/microsoft_logo.png";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";

import "./Hero.css"; // Updated CSS file name for clarity

function OrbitHero() {
  return (
    <section id="hero">
      <div className="orbit-content">
        <h1 id="welcome-to-ov">
          Welcome to your{" "}
          {/*<ReactTyped
            className="orbit-react-typed"
            strings={["good", "vibrant", "wonderful", "amazing"]}
            typeSpeed={50}
            backSpeed={30}
            loop
          />*/}
          <span className="orbit-react-typed">
            {" "}
            <span>
              {/*<span id="letter-o-as-ov-logo">
                <Image
                  src={OrbitViewPrimaryLogo}
                  alt="O"
                  style={{ display: "inline", height: "4rem", width: "auto" }}
                />
              </span>*/}
              OrbitView!
            </span>
            {/* If the logo does not render, the alt text will be rendered which is the "O" for OrbitView haha */}
          </span>
        </h1>
        <div className="orbit-auth-buttons">
          <button className="ov-hero-btn orbit-email-auth">
            Sign in using email, username or phone{" "}
            <MdEmail className="hero-sign-in-icon" />{" "}
            <FaUser className="hero-sign-in-icon" />{" "}
            <FaPhone className="hero-sign-in-icon" />
          </button>
          <button id="orbit-google-auth" className="ov-hero-btn">
            Continue with Google{" "}
            <Image
              style={{ height: "16px", width: "auto", display: "inline" }}
              src={GoogleLogo}
              alt=""
            />
          </button>
          <button
            id="orbit-microsoft-auth"
            className="ov-hero-btn orbit-microsoft-auth"
          >
            Continue using Microsoft{" "}
            <Image
              style={{ height: "16px", width: "auto", display: "inline" }}
              src={MicrosoftLogo}
              alt=""
            />
          </button>
        </div>
        <div className="orbit-signup">
          <p className="disclaimer">
            By clicking continue to join or sign up, you agree to OrbitView's{" "}
            <a className="agreement-link" href="/orbitview/user-agreement">
              User Agreement
            </a>
            ,{" "}
            <a href="/orbitview/privacy-policy/" className="agreement-link">
              Privacy Policy
            </a>
            ,{" "}
            <a href="/orbitview/cookie-policy" className="agreement-link">
              Cookie Policy
            </a>
            .
          </p>
          <a className="new-to-ov" href="#">
            New to OrbitView? Join now
          </a>
        </div>
      </div>
      <div className="orbit-logo">
        <Image src={OrbitViewPrimaryLogo} alt="OrbitView Logo" />
      </div>
    </section>
  );
}

export default OrbitHero;
