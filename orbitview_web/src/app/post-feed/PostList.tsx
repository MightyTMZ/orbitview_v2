"use client";

import React, { useEffect, useState } from "react";
import Post from "@/components/Post/Post";
import { useRouter } from "next/router";

interface User {
  username: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
}

interface Author {
  user: User;
  agree_to_guidelines: boolean;
  agree_to_punishments: boolean;
  agree_to_legal: boolean;
  agree_to_terms_and_conditions: boolean;
  has_signed: boolean;
  can_post_content: boolean;
}

interface Attachment {
  id: number;
  attachment: string;
}

interface PostProps {
  id: number;
  author: Author;
  post_type: string;
  main_content: string;
  attachments: Attachment[];
  created_at: string;
  archived: boolean;
}

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  // const router = useRouter();
  const accessT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0ODg4ODA1LCJpYXQiOjE3MzQ4ODE2MDUsImp0aSI6Ijc5ZjdlNjYzOTdiNjQwZjg5MTkwZDFiOGJlYTNkMjhjIiwidXNlcl9pZCI6MX0.Pg9Xz9HRxYpY7aR-xqofEzAqm6Wn40YWCBqGGWoInNs`;

  const invalid_token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/content/multilayered-posts/", {
      headers: { Authorization: `JWT ${invalid_token}` },
    })
      .then((response) => {
        if (!response.ok) {
          // Check if the response status indicates unauthorized access
          if (response.status === 401 || response.status === 403) {
            console.error("Unauthorized! Redirecting to login.");
            window.location.href = "/login" // Redirect to login page
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
        return response.json();
      })
      .then((data) => setPosts(data))
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [accessT]);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsList;
