"use client";

// import styles from "./PostPreviewCard.module.css"
import { backendServer } from "@/importantLinks";
import { useState, useEffect, useRef } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaShareSquare } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";

import axios from "axios";
import { useRouter } from "next/navigation";

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

/*const correctImagePath = (url: String) => {
  return `${backendServer}/${url}`;
};

const renderFullName = (author: Author) => {
  return `${author.user.first_name} ${author.user.last_name}`;
};*/

const PostCard = ({ post }: CardProps) => {
  const router = useRouter();

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


  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [likedPost, setLikedPost] = useState(false);
  const [savedPost, setSavedPost] = useState(false);

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
    const fetchSaveStatus = async () => {
      try {
        const response = await API.get(`/content/posts/${post.id}/save/`);
        const data = response.data;

        // Update the likedPost state only on the initial fetch
        setSavedPost(data.saved === "saved");
      } catch (error) {
        console.error("Error fetching saved status:", error);
      }
    };

    fetchLikeStatus();
    fetchSaveStatus();
  }); // Run only once on component mount

  const handleLikingPost = async () => {
    try {
      const response = await API.post(`/content/posts/${post.id}/like/`);

      setLikesCount(response.data.likes_count); // Update likes count
      setLikedPost((prevLikedPost) => !prevLikedPost); // Toggle the local state
      // send a visible message to the user saying that they liked or unliked the post in a professional element they can see instead of an alert

      if (response.status == 401) {
        router.replace("/login"); // redirect you to relogin
      } else if (response.status == 200) {
        // EVERYTHING GOOD 👍
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSavingPost = async (post: Post) => {
    try {
      const response = await API.post(`/content/posts/${post.id}/save/`);

      setSavedPost((prevSavedPost) => !prevSavedPost); // Toggle the local state
      // alert("Post was successfully saved.")

      if (response.status == 401) {
        router.replace("/login"); // redirect you to relogin
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleCommenting = async (post: Post) => {
    console.log("the user now wants to comment on this post" + post.id);
  };

  const handleSharingPost = (post: Post) => {
    console.log(`${post.title} ${post.id} was shared`);
  };

  const redirectToPostDetail = () => {
    router.push(`/post/${post.id}`);
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
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto mb-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl group">
      {/* Title */}
      <h2
        className={`text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 cursor-pointer`}
        onClick={() => redirectToPostDetail()}
      >
        {post.title}
      </h2>

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

      {/* Engagement Metrics */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="flex items-center"
          onClick={() => handleLikingPost()}
          style={{
            color: "#000d20", // OrbitView navy!
          }}
        >
          {likedPost ? <AiFillLike size={30} /> : <AiOutlineLike size={30} />}
          <span
            className="ml-1 text-gray-700 group-hover:text-indigo-600 transition-colors duration-300"
            style={{ fontSize: 24 }}
          >
            {likesCount}
          </span>
        </button>
        <button
          className="flex items-center text-blue-500 hover:text-blue-600"
          onClick={() => handleSharingPost(post)}
          style={{
            color: "#000d20", // OrbitView navy!
          }}
        >
          <FaShareSquare size={30} />
        </button>
        <button
          className="flex items-center text-gray-500 hover:text-gray-600"
          onClick={() => handleCommenting(post)}
        >
          <FaRegCommentDots size={30} />
          <span>&nbsp;5</span> {/* assume about 5ish comments */}
        </button>
        <button
          className="flex items-center text-gray-500 hover:text-gray-600"
          onClick={() => handleSavingPost(post)}
        >
          {savedPost ? <FaBookmark size={30} /> : <FaRegBookmark size={30} />}
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
