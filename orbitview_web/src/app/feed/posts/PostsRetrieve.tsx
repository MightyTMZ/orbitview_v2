"use client"; // for now with the fucking localStorage

import React from "react";
import { backendServer } from "@/components/importantLinks";

// Define interfaces
interface User {
  username: string;
  first_name: string;
  last_name?: string;
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
  attachment: string; // The URL of the attachment on the backend server
}

interface MultilayeredPost {
  id: number;
  author: Author;
  post_type: string;
  main_content: string;
  attachments: Attachment[];
  created_at: string;
  archived: boolean;
}

// Server-side function
export default async function PostsRetrieve() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (isAuthenticated != "true") {
    return <div>Please sign in to OrbitView to see posts</div>;
  }

  try {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(
      `${backendServer}/content/multilayered-posts/`,
      {
        cache: "no-store",
        headers: {
          Authorization: `JWT ${accessToken}`,
        },
      }
    );

    // Handle different HTTP statuses
    if (response.status === 405) {
      return (
        <div>Not signed in, please sign in to view posts on OrbitView</div>
      );
    } else if (response.status === 404) {
      return <div>Resource not found</div>;
    } else if (!response.ok) {
      return <div>An error occurred: {response.statusText}</div>;
    }

    // Parse the JSON response
    const data: MultilayeredPost[] = await response.json();

    console.log(data);

    // Render the posts
    return (
      <div>
        {data.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "16px",
              padding: "16px",
            }}
          >
            <h2>{post.author.user.username}</h2>
            <p>{post.main_content}</p>
            <div>
              {post.attachments.map((attachment) => (
                <img
                  key={attachment.id}
                  src={attachment.attachment}
                  alt={`Attachment ${attachment.id}`}
                  style={{ maxWidth: "100%", marginTop: "8px" }}
                />
              ))}
            </div>
            <small>
              Created at: {new Date(post.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return <div>An error occurred while fetching posts.</div>;
  }
}
