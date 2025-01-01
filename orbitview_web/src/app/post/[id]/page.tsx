"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { backendServer } from "@/importantLinks";
import { PostCard } from "./PostCard";

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
  updated: string;
  created: string;
  image: string;
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

const Page = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${backendServer}/content/posts/${id}/`);

      if (!response.ok) {
        setError("Error fetching post");
        return;
      }

      const responseData = await response.json();
      console.log(responseData); // Log the response structure

      setPost(responseData); // Or check for other possible fields
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <div className="mt-4">
        {error && <h1>{error}</h1>}
        {!post ? <h1>Hmm... Could not find post</h1> : <PostCard post={post} />}
        <div className="for-ads" style={{ 
          height: "50vh"
        }}></div>
      </div>
    </div>
  );
};

export default Page;
