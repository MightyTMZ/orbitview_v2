"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import styles from "../ProfilePage.module.css";
import PostsList from "../PostList";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Spinner from "@/components/Spinner/Spinner";
import { useRouter } from "next/navigation";
import PrivateAccountDisclaimer from "../PrivateAccountDisclaimer";
import MessageButton from "../MessageButton/MessageButton";
import FollowButton from "../FollowButton/FollowButton";
import ConnectButton from "../ConnectButton/ConnectButton";
import { debounce } from "lodash"; // Import lodash debounce

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
  created: string; // --> when did they join OrbitView
  image: string;
  followers_count: number;
  following_count: number;
}

// Profile component
const ProfilePagePosts = () => {
  const backendServer = "http://127.0.0.1:8000";
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile>();
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); // Track the current page
  const [hasMorePosts, setHasMorePosts] = useState(true); // Whether there are more posts to load

  const { isAuthenticated, current_user } = useSelector(
    (state: RootState) => state.auth
  );
  const [isTheUserSeeingTheirOwnProfile, setIsTheUserSeeingTheirOwnProfile] =
    useState(false);

  useEffect(() => {
    // Check if the current user is seeing their own profile
    if (isAuthenticated && current_user && profile) {
      const isOwnProfile = current_user.user.id === profile.user.id;
      setIsTheUserSeeingTheirOwnProfile(isOwnProfile);
    }
  }, [isAuthenticated, current_user, profile]);

  // Fetch the user profile and posts data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileFetchEndpoint = `${backendServer}/profile/${username}/`;
        const { data: profileData } = await axios.get(profileFetchEndpoint);
        setProfile(profileData);

        const postsFetchEndpoint = `${backendServer}/content/posts/${username}/?page=${page}`;
        const response = await axios.get(postsFetchEndpoint);

        if (response.data.results.length > 0) {
          setPosts((prevPosts) => prevPosts.concat(response.data.results));
        } else {
          setHasMorePosts(false); // No more posts to load
        }
      } catch (error) {
        console.error("Error fetching profile or content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, page]);

  const router = useRouter();

  useEffect(() => {
    if (contentType === "posts") {
      router.push(`posts`);
    } else if (contentType === "articles") {
      router.push(`articles`);
    } else if (contentType === "resources") {
      router.push(`resources`);
    } else if (contentType === "videos") {
      router.push(`videos`);
    } else if (contentType === "events") {
      router.push(`events`);
    }
  }, [contentType, username]);

  // Debounce the scroll event to prevent multiple calls in quick succession
  const handleScroll = debounce(() => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;
    if (bottom && hasMorePosts) {
      setPage((prevPage) => prevPage + 1); // Load next page
    }
  }, 300); // 300ms debounce delay

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMorePosts]);

  if (loading) {
    return <Spinner />;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  const getProfileURL = () => {
    return `${backendServer}/profile/${username}`;
  };

  const followURL = getProfileURL + "/follow/";
  const profileConnectionsListURL = `${backendServer}/social/connections/`;

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
            <button
              className={styles.actionBtn}
              onClick={() => console.log("Edit profile has been clicked")}
            >
              Edit Profile
            </button>
            <button
              className={styles.actionBtn}
              onClick={() => console.log("View archive has been clicked")}
            >
              View Archive
            </button>
            <button
              className={styles.actionBtn}
              onClick={() => console.log("Dashboard has been clicked.")}
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
                  contentType === type ? styles.active : ""
                }`}
                onClick={() => setContentType(type)}
              >
                {type[0].toUpperCase() + type.substring(1)}
              </div>
            )
          )}
          <div className={`${styles.highlight} ${styles[contentType]}`} />
        </div>
      </div>

      <div id="list-of-their-posts" className="container mx-auto mt-8 px-4">
        {profile.is_private ? (
          <PrivateAccountDisclaimer />
        ) : (
          <>
            {posts.length > 0 ? (
              <PostsList posts={posts}></PostsList>
            ) : (
              <div>No posts yet</div>
            )}
            {!hasMorePosts && <div>No more posts to load.</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePagePosts;
