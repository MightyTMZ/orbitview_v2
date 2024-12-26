"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import styles from "./ProfilePage.module.css";
import PostPreviewCard from "./PostPreviewCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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

// Profile component
const ProfilePage = () => {
  const backendServer = "http://127.0.0.1:8000";
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile>();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const { isAuthenticated, current_user } = useSelector(
    (state: RootState) => state.auth
  );
  const [isTheUserSeeingTheirOwnProfile, setIsTheUserSeeingTheirOwnProfile] =
    useState(false);


  console.log("User is authenticated: " + isAuthenticated);
  console.log("User is: " + current_user);

  // user --> the current user in the Redux state
  // profile --> the fetched profile based on the URL

  // console.log(profileFetchEndpoint);

  useEffect(() => {
    if (username) {
      const fetchProfileandPosts = async () => {
        try {
          const profileFetchEndpoint = `${backendServer}/profile/${username}/`;
          const fetchProfileResponse = await axios.get(profileFetchEndpoint);
          setProfile(fetchProfileResponse.data);

          if (isAuthenticated && current_user && profile) {
            const isOwnProfile = current_user.user.id == profile.user.id;
            setIsTheUserSeeingTheirOwnProfile(isOwnProfile);
          }

          const postsByUserFetchEndpoint = `${backendServer}/content/posts/${username}/`;
          const fetchPostsByUserResponse = await axios.get(
            postsByUserFetchEndpoint
          );
          setPosts(fetchPostsByUserResponse.data);
          console.log(posts); // testing
        } catch (error) {
          console.error("Error fetching profile or posts", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfileandPosts();
    }
  }, [username, isAuthenticated, current_user]);

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

        {isTheUserSeeingTheirOwnProfile ? (
          <>
            <button className={styles.actionBtn}>Edit Profile</button>
            <button className={styles.actionBtn}>View Archive</button>
            <button className={styles.actionBtn}>Dashboard</button>
          </>
        ) : (
          <>
            <button className={styles.actionBtn}>Connect</button>
            <button className={styles.actionBtn}>Follow</button>
            <button className={styles.actionBtn}>Message</button>
          </>
        )}
      </div>
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-4xl font-extrabold text-white mb-6">Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            <div>
              {posts.map((userPost) => (
                <PostPreviewCard key={userPost} post={userPost} />
              ))}
            </div>
          ) : (
            <div>No posts yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
