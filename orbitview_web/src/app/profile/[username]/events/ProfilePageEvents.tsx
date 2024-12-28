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
import ContentTypeComingSoon from "../ContentTypeComingSoon";
import MessageButton from "../MessageButton/MessageButton";
import FollowButton from "../FollowButton/FollowButton";
import ConnectButton from "../ConnectButton/ConnectButton";

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
const ProfilePageEvents = () => {
  const backendServer = "http://127.0.0.1:8000";
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile>();
  const [loading, setLoading] = useState(true);

  // what type of content is it being rendered right now?

  const [contentType, setContentType] = useState("events");

  // const [events, setEvents] = useState([]);

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

  // console.log("User is authenticated: " + isAuthenticated);
  // console.log("User is: " + current_user);

  // user --> the current user in the Redux state
  // profile --> the fetched profile based on the URL

  // console.log(profileFetchEndpoint);

  useEffect(() => {
    if (username) {
      const fetchData = async () => {
        try {
          setLoading(true);

          // Fetch user profile
          const profileFetchEndpoint = `${backendServer}/profile/${username}/`;
          const { data: profileData } = await axios.get(profileFetchEndpoint);
          setProfile(profileData);

          // by default, we fetch the posts
          // const postsFetchEndpoint = `${backendServer}/content/posts/${username}/`;
          // const { data: postsData } = await axios.get(postsFetchEndpoint);
          // setPosts(postsData);
        } catch (error) {
          console.error("Error fetching profile or content:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [username, contentType]);

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

  const handleFollowingUser = () => {
    console.log(`${username} was just followed...`);
  };

  const handleConnectingUser = () => {
    console.log(`Connecting request was just sent to ${username}`);
  };

  const handleMessageUser = () => {
    console.log(`Messaging ${username} right now`);
  };

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

        {/* Follow button */}

        {isTheUserSeeingTheirOwnProfile ? (
          <>
            <button
              className={styles.actionBtn}
              onClick={() => handleClickOnEditProfile()}
            >
              Edit Profile
            </button>
            <button
              className={styles.actionBtn}
              onClick={() => handleViewArchive()}
            >
              View Archive
            </button>
            <button
              className={styles.actionBtn}
              onClick={() => handleClickOnDashboard()}
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
        {/*<h1 className="text-4xl font-extrabold text-black mb-6">Posts</h1>*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/*<div>
              {posts.map((userPost) => (
                <PostPreviewCard key={userPost} post={userPost} />
              ))}
            </div>*/}
          {profile.is_private ? (
            <PrivateAccountDisclaimer />
          ) : (
            <>
              <ContentTypeComingSoon contentType="Events" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageEvents;
