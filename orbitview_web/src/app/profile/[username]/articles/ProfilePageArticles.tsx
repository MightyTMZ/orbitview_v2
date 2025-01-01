"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Spinner from "@/components/Spinner/Spinner";
import { debounce } from "lodash"; // Import lodash debounce
import { backendServer } from "@/importantLinks";
import ArticleList from "../ArticleList";
import ProfilePage from "../ProfilePage";

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
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]); // Specify post types
  const [page, setPage] = useState(1); // Track the current page
  const [hasMoreArticles, setHasMoreArticles] = useState(true); // Whether there are more posts to load

  // Fetch the user profile and posts data
  useEffect(() => {
    const fetchData = async () => {
      try {
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

  return (
    <>
      <ProfilePage content_type="articles" />

      <div id="list-of-their-posts" className="container mx-auto mt-8 px-4">
        <>
          {articles.length > 0 ? (
            <ArticleList articles={articles} />
          ) : (
            <div>No articles yet</div>
          )}
          {!hasMoreArticles && <div>No more articles to load.</div>}
        </>
      </div>
    </>
  );
};

export default ProfilePageArticles;
