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
        <button className={styles.actionBtn}>Connect</button>
        <button className={styles.actionBtn}>Follow</button>
        <button className={styles.actionBtn}>Message</button>
      </div>
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-4xl font-extrabold text-white mb-6">Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((userPost: Post) => (
            <PostPreviewCard key={userPost.date_posted} post={userPost} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
