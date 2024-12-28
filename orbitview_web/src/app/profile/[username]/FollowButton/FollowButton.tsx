"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendServer } from "@/importantLinks";
import styles from "./FollowButton.module.css";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Profile {
  user: User;
  is_private: boolean;
  is_online: boolean;
  bio: string;
  by_line: string;
  date_of_birth: string;
  updated: string;
  created: string; //  --> when did they join OrbitView
  image: string;
  followers_count: number;
  following_count: number;
}

interface FollowButtonProps {
  profile: Profile;
}

const FollowButton = ({ profile }: FollowButtonProps) => {
  const API = axios.create({
    baseURL: backendServer, // Replace with your backend's base URL
    withCredentials: true,
  });

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken"); // Assume the JWT token is stored in localStorage
    const csrfToken = fetchCsrfToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  });

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch(`${backendServer}/csrf-token/`, {
        method: "GET",
      });

      const data = await response.json();
      const csrfToken = data.csrfToken;
      return csrfToken;
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  };

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await API.get(
          `/profile/${profile.user.username}/follow/`
        );
        const data = response.data;

        // Update the likedPost state only on the initial fetch
        setIsFollowing(data.following === "following");
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollowStatus();
  }, []);

  return (
    <button
      className={`${styles.followButton} ${
        isFollowing ? styles.following : ""
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
