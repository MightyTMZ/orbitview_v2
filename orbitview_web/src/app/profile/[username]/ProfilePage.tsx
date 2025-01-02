"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import styles from "./ProfilePage.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MessageButton from "./MessageButton/MessageButton";
import FollowButton from "./FollowButton/FollowButton";
import ConnectButton from "./ConnectButton/ConnectButton";
import { backendServer } from "@/importantLinks";

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
  created: string;
  image: string;
  followers_count: number;
  following_count: number;
}

interface ProfilePageProps {
  content_type: string;
}

// Profile component
const ProfilePage = ({ content_type }: ProfilePageProps) => {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, current_user } = useSelector(
    (state: RootState) => state.auth
  );

  // Memoize derived state
  const isTheUserSeeingTheirOwnProfile = useMemo(() => {
    return isAuthenticated && current_user && profile
      ? current_user.user.id === profile.user.id
      : false;
  }, [isAuthenticated, current_user, profile]);

  // Fetch profile once
  useEffect(() => {
    if (username) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${backendServer}/profile/${username}/`);
          setProfile(response.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  const handleClickOnDashboard = () => {
    if (current_user) {
      console.log(
        `You are logged in as ${current_user.user.username}. Hope you enjoy your dashboard`
      );
    } else {
      console.log(
        "You are signed in. Please make an account so you gain access to your very own dashboard"
      );
    }
  };

  const handleClickOnEditProfile = () => {
    if (current_user) {
      console.log(
        "Redirecting you to the page so you can edit your profile..."
      );
    } else {
      console.log(
        "You are not signed in. I don't know who you are so I don't which profile I should allow you to edit."
      );
    }
  };

  const handleViewArchive = () => {
    if (current_user) {
      console.log("Redirecting you to your archive page");
    } else {
      console.log("NO ARCHIVE. Please log in to see your archive.");
    }
  };

  return (
    <div className={styles.profilePage}>
      {/* Profile image */}
      <div className={styles.profileHeader}>
        <img
          src={`${backendServer}/${profile.image}`}
          alt={`${profile.user.first_name} ${profile.user.last_name}`}
          className={styles.profileImg}
        />
      </div>

      {/* User details */}
      <div className={styles.profileDetail}>
        <h1 className={styles.profileH1}>
          {profile.user.first_name} {profile.user.last_name}
        </h1>
        <p className={styles.bio}>{profile.bio}</p>
        <p className={styles.byline}>{profile.by_line}</p>

        {/* Followers and following */}
        <div className={styles.followInfo}>
          <div className={styles.followCount}>
            <strong>{profile.followers_count}</strong> Followers
          </div>
          <div className={styles.followCount}>
            <strong>{profile.following_count}</strong> Following
          </div>
        </div>

        {/* Buttons */}
        {isTheUserSeeingTheirOwnProfile ? (
          <>
            <button
              className={styles.actionBtn}
              onClick={handleClickOnEditProfile}
            >
              Edit Profile
            </button>
            <button
              className={styles.actionBtn}
              onClick={handleViewArchive}
            >
              View Archive
            </button>
            <button
              className={styles.actionBtn}
              onClick={handleClickOnDashboard}
            >
              Dashboard
            </button>
          </>
        ) : (
          <>
            <ConnectButton />
            <FollowButton profile={profile} />
            <MessageButton />
          </>
        )}
      </div>

      <div className={styles.adjustmentBarContainer}>
        <div className={styles.adjustmentBar}>
          {["posts", "articles", "resources", "videos", "events"].map(
            (type) => (
              <div
                key={type}
                className={`${styles.adjustmentTab} ${
                  content_type === type ? styles.active : ""
                }`}
                onClick={() => (window.location.href = `/profile/${username}/${type}`)}
              >
                {type[0].toUpperCase() + type.substring(1)}
              </div>
            )
          )}
          <div className={`${styles.highlight} ${styles[content_type]}`} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
