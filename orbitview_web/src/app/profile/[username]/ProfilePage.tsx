"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import styles from "./ProfilePage.module.css";

// Profile component
const ProfilePage = () => {
  const backendServer = "http://127.0.0.1:8000";
  const { username } = useParams();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchEndpoint = `${backendServer}/profile/${username}/`;

  console.log(fetchEndpoint);

  useEffect(() => {
    if (username) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(fetchEndpoint);
          setProfile(response.data);
          console.log(profile);
        } catch (error) {
          console.error("Error fetching profile", error);
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

        {/* Follow button */}
        <button className={styles.followBtn}>Follow</button>
      </div>
    </div>
  );
};

export default ProfilePage;
