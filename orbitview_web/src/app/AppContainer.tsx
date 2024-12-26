"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { backendServer } from "@/components/importantLinks";
import Link from "next/link";
import { FaUserCircle, FaTimes, FaBars } from "react-icons/fa";
import styles from "./AppContainer.module.css";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Spinner from "@/components/Spinner/Spinner";
import Image from "next/image";

interface Props {
  children: ReactNode;
}

const AppContainer = (props: Props) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navbarOrientation, setNavbarOrientation] = useState("top"); // ['top', 'left', 'right', 'bottom']
  // const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [isWideForRightOrLeft, setisWideForRightOrLeft] = useState(false);
  // const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  /* if (user || error) {
    // ghost reference
  } */

  const { isAuthenticated, current_user } = useSelector(
    (state: RootState) => state.auth
  );

  const checkDeviceType = () => {
    setisWideForRightOrLeft(window.innerWidth >= 1500);
  };

  useEffect(() => {
    checkDeviceType(); // Check on initial load
    window.addEventListener("resize", checkDeviceType); // Recheck on window resize

    if (
      !isWideForRightOrLeft &&
      (navbarOrientation === "right" || navbarOrientation === "left")
    ) {
      setNavbarOrientation("top");
    }

    return () => {
      window.removeEventListener("resize", checkDeviceType); // Clean up the event listener
    };
  }, [navbarOrientation, isWideForRightOrLeft]); // Add both `navbarOrientation` and `isWideForRightOrLeft` as dependencies

  /*const renewUserLogin = async () => {
    if (!refreshToken) return; // Skip if refreshToken doesn't exist

    try {
      const response = await fetch(`${backendServer}/auth/jwt/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }), // Ensure the key matches your backend API
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed!");
      }

      
    } catch (error: any) {
      console.error("Error during login:", error.message || error);
      
    }
  };*/

  /* const getUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`${backendServer}/auth/users/me/`, {
        method: "GET", // Typically, GET is used to fetch user data
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${accessToken}`, // JWT in Authorization header
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to retrieve profile");
      }

      setUser(data); // Store the user data in state
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setError(error);
    }
  }; */

  const renderingAppropriateNavbar = () => {
    if (isNavbarCollapsed) return null;
    switch (navbarOrientation) {
      case "top":
        return (
          <nav
            className={`bg-gray-800 p-4 text-white flex justify-between items-center ${styles.nav} ${styles.topNavigation}`}
          >
            <Link href="/" className="text-2xl font-bold mr-2">
              OrbitView
            </Link>
            <div className="space-x-4">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/events">Events</Link>
              <Link href="/network">Network</Link>
              <Link href="/learn">Learn</Link>

              {isAuthenticated && current_user ? (
                <>
                  <Image
                    src={`${backendServer}/${current_user.image}`}
                    alt={`${current_user.user.first_name} ${current_user.user.last_name}`}
                    height={30}
                    width={30}
                    style={{  
                      display: "inline"

                    }}
                  ></Image>
                  <Link href="/logout">Log Out</Link>
                </>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/signup">Sign Up</Link>
                </>
              )}
            </div>
          </nav>
        );
      case "bottom":
        return (
          <nav
            className={`bg-gray-800 p-4 text-white flex justify-between items-center ${styles.nav} ${styles.bottomNavigation}`}
          >
            <Link href="/" className="text-2xl font-bold mr-2">
              OrbitView
            </Link>
            <div className="space-x-4">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/events">Events</Link>
              <Link href="/network">Network</Link>
              <Link href="/learn">Learn</Link>

              {isAuthenticated ? (
                <>
                  <FaUserCircle size={30} className="inline-block" />
                  <Link href="/logout">Log Out</Link>
                </>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/signup">Sign Up</Link>
                </>
              )}
            </div>
          </nav>
        );

      case "left":
        return (
          <nav
            className={`${styles.leftNavigation} text-white text-start ${styles.nav}`}
          >
            <Link href="/" className="text-2xl font-bold mb-6">
              OrbitView
            </Link>
            <div className="flex flex-col space-y-4">
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <Link href="/events" className={styles.navLink}>
                Events
              </Link>
              <Link href="/network" className={styles.navLink}>
                Network
              </Link>
              <Link href="/learn" className={styles.navLink}>
                Learn
              </Link>

              {isAuthenticated ? (
                <>
                  <FaUserCircle size={30} className="inline-block" />
                  <Link href="/logout" className={styles.navLink}>
                    Log Out
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.navLink}>
                    Login
                  </Link>
                  <Link href="/signup" className={styles.navLink}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        );
      case "right":
        return (
          <nav className={`${styles.rightNavigation} text-white ${styles.nav}`}>
            <Link href="/" className="text-2xl font-bold mb-6">
              OrbitView
            </Link>
            <div className="flex flex-col space-y-4">
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <Link href="/events" className={styles.navLink}>
                Events
              </Link>
              <Link href="/network" className={styles.navLink}>
                Network
              </Link>
              <Link href="/learn" className={styles.navLink}>
                Learn
              </Link>

              {isAuthenticated ? (
                <>
                  <FaUserCircle size={30} className="inline-block ml-auto" />
                  <Link href="/logout" className={styles.navLink}>
                    Log Out
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.navLink}>
                    Login
                  </Link>
                  <Link href="/signup" className={styles.navLink}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        );
      default:
        return (
          <nav
            className={`bg-gray-800 p-4 text-white flex justify-between items-center ${styles.nav} ${styles.topNavigation}`}
          >
            <Link href="/" className="text-2xl font-bold mr-2">
              OrbitView
            </Link>
            <div className="space-x-4">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/events">Events</Link>
              <Link href="/network">Network</Link>
              <Link href="/learn">Learn</Link>

              {isAuthenticated ? (
                <>
                  <FaUserCircle size={30} className="inline-block" />
                  <Link href="/logout">Log Out</Link>
                </>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/signup">Sign Up</Link>
                </>
              )}
            </div>
          </nav>
        );
    }
  };

  {
    /* const renderControlPanel = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({
      x: 0,
      y: 0.5 * window.innerHeight,
    }); // Initial position
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false); // Collapse state

    const handleDragStart = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleDrag = (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    return (
      <div
        className={`${styles.controlPanel} fixed bg-gray-700 p-4 rounded shadow-lg`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? "grabbing" : "grab",
          zIndex: "99999",
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd} // Handles when mouse leaves the panel
      >
        <button
          onClick={() => setIsNavbarCollapsed((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          {isNavbarCollapsed ? <FaBars /> : <FaTimes />}
        </button>

        {!isNavbarCollapsed && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setNavbarOrientation("top")}
              className="bg-gray-800 text-white p-2 rounded"
            >
              Top
            </button>
            <button
              onClick={() => setNavbarOrientation("bottom")}
              className="bg-gray-800 text-white p-2 rounded"
            >
              Bottom
            </button>
            {isWideForRightOrLeft ? (
              <button
                onClick={() => setNavbarOrientation("left")}
                className="bg-gray-800 text-white p-2 rounded"
              >
                Left
              </button>
            ) : (
              <></>
            )}
            {isWideForRightOrLeft ? (
              <button
                onClick={() => setNavbarOrientation("right")}
                className="bg-gray-800 text-white p-2 rounded"
              >
                Right
              </button>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    );
  }; */
  }

  console.log(isWideForRightOrLeft);

  return (
    <div>
      {renderingAppropriateNavbar()}
      {/*renderControlPanel() */}
      <main
        id="main-content"
        style={{
          marginRight: navbarOrientation === "right" ? "200px" : "0",
        }}
      >
        {props.children}
      </main>
    </div>
  );
};

export default AppContainer;
