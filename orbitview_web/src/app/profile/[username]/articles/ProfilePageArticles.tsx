"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import styles from "../ProfilePage.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Spinner from "@/components/Spinner/Spinner";
import { useRouter } from "next/navigation";
import PrivateAccountDisclaimer from "../PrivateAccountDisclaimer";
import MessageButton from "../MessageButton/MessageButton";
import FollowButton from "../FollowButton/FollowButton";
import ConnectButton from "../ConnectButton/ConnectButton";
import { debounce } from "lodash"; // Import lodash debounce
import { backendServer } from "@/importantLinks";
import ArticleList from "../ArticleList";

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


interface Profile {
  image: string;
  by_line: string;
  is_online: boolean;
}

interface Author {
  id: number;
  first_name: string;
  last_name?: string;
  profile: Profile;
}

interface Article {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  author: Author;
  content: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  featured_image: string;
  public: boolean;
  archived: boolean;
  likes_count: number;
  shares_count: number;
  saves_count: number;
  hide_likes_count: number;
  hide_shares_count: number;
}



const ProfilePageArticles = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState("articles");
  const [articles, setArticles] = useState<Article[]>([]); // Specify post types
  const [page, setPage] = useState(1); // Track the current page
  const [hasMoreArticles, setHasMoreArticles] = useState(true); // Whether there are more posts to load

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
        setProfile(profileData); // Reset profile state

        // Reset posts state if profile changes
        setArticles([]); // Clear posts if profile changes
        setPage(1); // Reset the page when switching profiles

        const postsFetchEndpoint = `${backendServer}/content/articles/${username}/?page=${page}`;
        const response = await axios.get(postsFetchEndpoint);

        if (response.data.results.length > 0) {
          setArticles(response.data.results);
        } else {
          setHasMoreArticles(false); // No more to load
        }
      } catch (error) {
        console.error("Error fetching profile or content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, page]); // Fetch data whenever username or page changes

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
    if (bottom && hasMoreArticles) {
      setPage((prevPage) => prevPage + 1); // Load next page
    }
  }, 300); // 300ms debounce delay

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMoreArticles]);

  if (loading) {
    return <Spinner />;
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
            {articles.length > 0 ? (
              <ArticleList articles={articles} />
            ) : (
              <div>No articles yet</div>
            )}
            {!hasMoreArticles && <div>No more articles to load.</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePageArticles;
