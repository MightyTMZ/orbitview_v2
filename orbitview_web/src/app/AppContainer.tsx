"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { backendServer } from "@/components/importantLinks";
import Link from "next/link";
import styles from "./AppContainer.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import { TokenIsStillValid } from "./refreshLoginLogic";
import Image from "next/image";
import OrbitViewLogo from "./OrbitView_Media-removebg-preview (2).png";
// import axios from "axios";


interface Props {
  children: ReactNode;
}

const AppContainer: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, current_user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [navbarOrientation, setNavbarOrientation] = useState<"top" | "bottom" | "left" | "right">("top");
  const [isWideScreen, setIsWideScreen] = useState(false);

  

  useEffect(() => {
    const checkDeviceType = () => setIsWideScreen(window.innerWidth >= 1500);

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  useEffect(() => {
    if (!isWideScreen && (navbarOrientation === "left" || navbarOrientation === "right")) {
      setNavbarOrientation("top");
    }
  }, [isWideScreen, navbarOrientation]);


  useEffect(() => {
    if (!TokenIsStillValid()) {
      dispatch(logout());
    }
    // Add any dependencies for this effect if needed.  If it's solely for logout on token expiry, it might not need dependencies in this simplified version.
  }, []);


  const navLinks = [
    { href: "/search", label: "Search" },
    // { href: "/dashboard", label: "Dashboard" },
    // { href: "/events", label: "Events" },
    // { href: "/network", label: "Network" },
    // { href: "/learn", label: "Learn" },
  ];


  const renderNavbar = () => {
    const commonStyles = `bg-gray-800 p-4 text-white flex items-center ${styles.nav}`;
    const orientationStyles = {
      top: `justify-between ${styles.topNavigation}`,
      bottom: `justify-between ${styles.bottomNavigation}`,
      left: `flex-col ${styles.leftNavigation}`,
      right: `flex-col ${styles.rightNavigation}`,
    };
      
    return (
      <nav className={`${commonStyles} ${orientationStyles[navbarOrientation]}`}>
        {navbarOrientation === "top" && (
          <Image
            src={OrbitViewLogo}
            alt="OrbitView Logo"
            height={40}
            priority  // Prioritize loading this image
          />
        )}
        <Link href="/" className="text-2xl font-bold mr-2">
          OrbitView
        </Link>

        <div className={navbarOrientation === "top" || navbarOrientation === "bottom" ? "space-x-4" : "flex flex-col space-y-4"}>
          {navLinks.map((link) => (
             <Link key={link.href} href={link.href} className={navbarOrientation !== 'top' && navbarOrientation !== 'bottom' ? styles.navLink : ""}> {link.label}</Link>
          ))}

          {isAuthenticated && current_user ? (
            <>
              <img
                src={`${backendServer}/${current_user.image}`}
                alt={`${current_user.user.first_name} ${current_user.user.last_name}`}
                height={30}
                width={30}
                style={{ display: "inline", borderRadius: "50%" }}
              
              />
              <Link href="/logout">Log Out</Link>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/join">Join OrbitView</Link>
            </>
          )}
        </div>
      </nav>
    );
  };

  return (
    <div>
      {renderNavbar()}
      <main
        className={styles["main-content"]}
        style={{
          marginRight: navbarOrientation === "right" ? "200px" : "0",
          marginLeft: navbarOrientation === "left" ? "200px" : "0", // Add marginLeft for left orientation
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default AppContainer;