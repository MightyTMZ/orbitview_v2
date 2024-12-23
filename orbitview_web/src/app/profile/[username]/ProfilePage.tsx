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
  const [posts, setPosts] = useState([]);

  // console.log(profileFetchEndpoint);

  useEffect(() => {
    if (username) {
      const fetchProfileandPosts = async () => {
        try {
          const profileFetchEndpoint = `${backendServer}/profile/${username}/`;
          const response1 = await axios.get(profileFetchEndpoint);
          setProfile(response1.data);
          const postsByUserFetchEndpoint = `${backendServer}/content/posts/${username}/`;
          console.log(postsByUserFetchEndpoint);
          const response2 = await axios.get(postsByUserFetchEndpoint);
          setPosts(response2.data);
          console.log(posts); // testing
        } catch (error) {
          console.error("Error fetching profile or posts", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfileandPosts();
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
      <div className={styles.postsContainer}>
        <h2>Posts by {profile.user.first_name}</h2>
        {posts.length === 0 ? (
          <p>
            No posts from {profile.first_name} {profile.last_name} yet.
          </p>
        ) : (
          posts.map((post: any) => (
            <div key={post.id} className={styles.post}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postContent}>{post.content}</p>
              {/* You can add more post details here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
