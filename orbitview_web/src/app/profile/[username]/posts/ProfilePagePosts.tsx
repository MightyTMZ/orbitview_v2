"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import PostsList from "../PostList";
import Spinner from "@/components/Spinner/Spinner";
import { debounce } from "lodash"; // Import lodash debounce
import { backendServer } from "@/importantLinks";
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

interface Author {
  user: User;
  is_private: boolean;
  is_online: boolean;
  bio: string;
  by_line: string;
  date_of_birth: string;
  updated: string; // when did the user last update their profile
  created: string; // when did the user join OrbitView?
  image: string; //e.g. "/profile_pics/tom.jpg",
  followers_count: number;
  following_count: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: Author;
  date_posted: string;
  date_updated: string;
  likes_count: number;
  shares_count: number;
  saves_count: number;
}

const ProfilePagePosts = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]); // Specify post types
  const [page, setPage] = useState(1); // Track the current page
  const [hasMorePosts, setHasMorePosts] = useState(true); // Whether there are more posts to load



 
  // Fetch the user profile and posts data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPosts([]); // Clear posts if profile changes
        setPage(1); // Reset the page when switching profiles

        const postsFetchEndpoint = `${backendServer}/content/posts/${username}/?page=${page}`;
        const response = await axios.get(postsFetchEndpoint);

        if (response.data.results.length > 0) {
          setPosts(response.data.results);
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
  }, [username, page]); // Fetch data whenever username or page changes

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

  return (
    <>
      <ProfilePage content_type="posts" />
      <div id="list-of-their-posts" className="container mx-auto mt-8 px-4">
        <>
          {posts.length > 0 ? (
            <PostsList posts={posts} />
          ) : (
            <div>No posts yet</div>
          )}
          {!hasMorePosts && <div>No more posts to load.</div>}
        </>
      </div>
    </>
  );
};

export default ProfilePagePosts;
