"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendServer } from "@/importantLinks";
import styles from "./FollowButton.module.css";

interface User {
  id: number;
  username: string;
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
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch follow status on mount
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await API.get(
          `/profile/${profile.user.username}/follow/`
        );
        setIsFollowing(response.data.following === "following");
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollowStatus();
  });

  // Toggle follow status
  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      const response = await API.post(
        `/profile/${profile.user.username}/follow/`
      );
      const message = response.data.message;

      // Update UI based on the response message
      if (message.includes("now following")) {
        setIsFollowing(true);
      } else if (message.includes("unfollowed")) {
        setIsFollowing(false);
      } else if (message.includes("Follow request sent")) {
        alert("Follow request sent for private profile.");
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`${styles.followButton} ${
        isFollowing ? styles.following : ""
      }`}
      onClick={handleFollowToggle}
      disabled={isLoading || isFollowing === null}
    >
      {isLoading ? "Processing..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
