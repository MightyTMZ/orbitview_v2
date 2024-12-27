"use client";

// import styles from "./PostPreviewCard.module.css"
import { backendServer } from "@/importantLinks";
import { useState, useEffect, useRef } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";

import axios from "axios";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
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

interface CardProps {
  post: Post;
}

interface PostListProps {
  posts: Post[];
}

const correctImagePath = (url: String) => {
  return `${backendServer}/${url}`;
};

const renderFullName = (author: Author) => {
  return `${author.user.first_name} ${author.user.last_name}`;
};

const PostCard = ({ post }: CardProps) => {
  const contentRef = useRef<HTMLDivElement>(null); // Ref for the content div
  const [isOverflowing, setIsOverflowing] = useState(false); // Track if content overflows
  const [showFullContent, setShowFullContent] = useState(false); // Track if full content is shown

  const API = axios.create({
    baseURL: backendServer, // Replace with your backend's base URL
    withCredentials: true,
  });

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken"); // Assume the JWT token is stored in localStorage
    const csrfToken = fetchCsrfToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  });

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch(`${backendServer}/csrf-token/`, {
        method: "GET",
      });

      const data = await response.json();
      const csrfToken = data.csrfToken;
      return csrfToken;
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  };

  const getPostFullURL = (post: Post) => {
    return `${backendServer}/posts/${post.id}`;
  };

  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [likedPost, setLikedPost] = useState(false);

  // fetch the status to see if the post is already liked or not

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await API.get(`/content/posts/${post.id}/like/`);
        const data = response.data;
  
        // Update the likedPost state only on the initial fetch
        setLikedPost(data.liked === "liked");
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };
  
    fetchLikeStatus();
  }, []); // Run only once on component mount
  
  const handleLikingPost = async () => {
    try {
      const response = await API.post(`/content/posts/${post.id}/like/`);
      setLikesCount(response.data.likes_count); // Update likes count
      setLikedPost((prevLikedPost) => !prevLikedPost); // Toggle the local state
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSavingPost = async (post: Post) => {
    const saveURL = getPostFullURL(post) + "/save/";
  };

  const handleSharingPost = (post: Post) => {
    console.log(`${post.title} ${post.id} was shared`);
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        // Compare scrollHeight with offsetHeight to determine overflow
        setIsOverflowing(
          contentRef.current.scrollHeight > contentRef.current.offsetHeight
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow); // Recheck on window resize

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [post.content]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto mb-6">
      {/* Author Details */}
      <div className="flex items-center mb-4">
        <img
          className="w-12 h-12 rounded-full mr-4"
          src={correctImagePath(post.author.image)}
          alt={`${post.author.user.first_name} ${post.author.user.last_name}`}
        />
        <div>
          <h3 className="font-semibold text-lg">
            {renderFullName(post.author)}
          </h3>
          <p className="text-sm text-gray-500">{post.author.by_line}</p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold mb-3">{post.title}</h2>

      {/* Content */}
      <div>
        <div
          ref={contentRef}
          className={`text-gray-700 text-base mb-4 ${
            showFullContent ? "max-h-full" : "max-h-[100px] overflow-hidden"
          }`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
        {isOverflowing && !showFullContent && (
          <button
            className="text-blue-500 hover:underline mt-2"
            onClick={() => setShowFullContent(true)}
          >
            See More
          </button>
        )}
        {showFullContent && (
          <button
            className="text-blue-500 hover:underline mt-2"
            onClick={() => setShowFullContent(false)}
          >
            See Less
          </button>
        )}
      </div>

      {/* Image (if exists) 
      {post.image && (
        <img
          className="rounded-lg w-full object-cover h-64 mb-4"
          src={post.image}
          alt="Post image"
        />
      )}*/}

      {/* Engagement Metrics */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="flex items-center"
          onClick={() => handleLikingPost()}
          style={{  
            color: "#000d20" // OrbitView navy!
          }}
        >
          {likedPost ? <AiFillLike size={30} /> : <AiOutlineLike size={30} />}

          <span style={{ fontSize: 24, marginLeft: "3px" }}>{likesCount}</span>
        </button>
        <button
          className="flex items-center text-blue-500 hover:text-blue-600"
          onClick={() => handleSharingPost(post)}
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21 11.11c-.61-.35-1.28-.6-2-.73V4c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v6c-.6.07-1.19.23-1.73.49C6.6 11.11 4 14.09 4 17.79c0 3.32 2.69 6.02 6 6.21V22h4v-1.99c1.1-.08 2-.76 2.54-1.67.54-.91.68-2.01.39-3.06-.29-1.05-.99-1.98-1.93-2.57-.94-.59-2.06-.84-3.17-.68-.78.11-1.52.46-2.1.99V6.39c.72.11 1.44.33 2.09.66C12.07 8.41 14.5 10.86 14.5 14H17v2.34c.48-.45 1.01-.83 1.6-1.1.59-.27 1.22-.44 1.87-.5v-1.63c0-.69-.08-1.36-.24-2-.13-.51-.35-.99-.66-1.44z" />
          </svg>
          {post.shares_count}
        </button>
        <button
          className="flex items-center text-gray-500 hover:text-gray-600"
          onClick={() => handleSavingPost(post)}
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M19 3h-4.18C14.4 2.42 13.3 2 12 2c-1.3 0-2.4.42-3.82 1H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6v-6h4v6h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14h-6v-4h-4v4H4V5h15v12z" />
          </svg>
          {post.saves_count}
        </button>
      </div>
    </div>
  );
};

const PostsList = ({ posts }: PostListProps) => {
  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsList;
