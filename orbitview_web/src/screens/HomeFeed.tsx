"use client";

import { useEffect, useState } from "react";
import { backendServer } from "@/importantLinks";
import axios from "axios";
import { PostCard } from "@/app/post/[id]/PostCard";

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
  created: string; // when did they join OrbitView
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

interface Article {
  id: number;
  title: string;
  subtitle: string;
}

const HomeFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const [postPage, setPostPage] = useState(1);
  const [articlePage, setArticlePage] = useState(1);

  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const [hasMoreProfiles, setHasMoreProfiles] = useState(true);

  const postsEndpoint = `${backendServer}/content/posts/`;
  const articlesEndpoint = `${backendServer}/content/articles/`;

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${postsEndpoint}?page=${postPage}`);

      console.log(response.json());

      // if (response.data.results.length === 0) setHasMorePosts(false);
      // setPosts((prev) => [...prev, ...response.data.results]);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  // Fetch articles
  const fetchArticles = async () => {
    try {
      const response = await fetch(`${articlesEndpoint}?page=${articlePage}`);

      console.log(response.json());

      // if (response.data.results.length === 0) setHasMoreArticles(false);
      // setArticles((prev) => [...prev, ...response.json()]);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [postPage]);

  useEffect(() => {
    fetchArticles();
  }, [articlePage]);

  return (
    <div className="home-feed px-20">
      <h1 className="text-3xl font-bold mb-4">Home Feed</h1>

      {/* Posts */}
      <div className="posts mb-6">
        <h2 className="text-2xl font-semibold mb-3">Posts</h2>
        {posts.map((p) => (
          <PostCard post={p}/>
        ))}
        {hasMorePosts && (
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setPostPage((prev) => prev + 1)}
          >
            Load More Posts
          </button>
        )}
      </div>

      {/* Articles */}
      <div className="articles mb-6">
        <h2 className="text-2xl font-semibold mb-3">Articles</h2>
        {articles.map((article) => (
          <div
            key={article.id}
            className="article-card p-4 border rounded-lg shadow-md mb-4"
          >
            <h3 className="text-xl font-bold">{article.title}</h3>
            <p className="text-gray-500">{article.subtitle}</p>
          </div>
        ))}
        {hasMoreArticles && (
          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => setArticlePage((prev) => prev + 1)}
          >
            Load More Articles
          </button>
        )}
      </div>

      
    </div>
  );
};

export default HomeFeed;
