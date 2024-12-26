"use client";

// import styles from "./PostPreviewCard.module.css"
import { backendServer } from "@/importantLinks";
import { useState, useEffect, useRef } from "react";

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

  const getPostFullURL = (post: Post) => {
    return `${backendServer}/posts/${post.id}`;
  };

  const likeURL = getPostFullURL(post) + "/like/";
  const saveURL = getPostFullURL(post) + "/save/";

  const handleLikingPost = (post: Post) => {
    console.log(`${post.title} ${post.id} was liked`);
  };

  const handleSharingPost = (post: Post) => {
    console.log(`${post.title} ${post.id} was shared`);
  };

  const handleSavingPost = (post: Post) => {
    console.log(`${post.title} ${post.id} was saved`);
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
          className="flex items-center text-red-500 hover:text-red-600"
          onClick={() => handleLikingPost(post)}
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {post.likes_count}
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
