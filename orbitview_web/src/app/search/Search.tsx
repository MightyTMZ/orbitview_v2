"use client";

import React, { useState } from "react";
import styles from "./Search.module.css";
import { backendServer } from "@/importantLinks";

interface ArticleProfile {
  image: string;
  by_line: string;
  is_online: string;
}

interface ArticleAuthor {
  id: number;
  first_name: string;
  last_name?: string;
  profile: ArticleProfile;
}

interface Article {
  id: number;
  title: string;
  subtitle: string;
  author: ArticleAuthor;
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

interface PostUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

interface PostAuthor {
  user: PostUser;
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
  author: PostAuthor;
  date_posted: string;
  full_author: string;
  date_updated: string;
  likes_count: number;
  shares_count: number;
  saves_count: number;
}

// the type that is passed to the user's search result
interface User {
  username: string;
  first_name: string;
  last_name: string;
  image: string;
}

interface SearchResult {
  users: User[];
  posts: Post[];
  articles: Article[];
}

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult>({
    users: [],
    posts: [],
    articles: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query: String) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendServer}/search/?query=${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      const data = await response.json();
      console.log(data);
      setSearchResults(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page p-6">
      <div className={styles["search-bar"]}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const newQuery = e.target.value;
            setQuery(newQuery);
            // handleSearch(newQuery); // Pass the updated value directly
          }}
          placeholder="Search for users, posts, or articles"
          className={styles["search-input"]}
        />
        <button
          onClick={() => handleSearch(query)}
          className={styles["search-button"]}
        >
          Search
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="search-results">
        {searchResults && (
          <>
            {searchResults.users.length > 0 && (
              <div className="users-results mb-6">
                <h2 className="text-xl font-bold mb-2">Users</h2>
                {searchResults.users.map((user, index) => (
                  <div
                    key={index}
                    className="user-card border p-2 rounded mb-2"
                  >
                    <img
                      src={`${backendServer}/${user.image}`}
                      alt={user.first_name + " " + user.last_name}
                      style={{
                        borderRadius: "50%",
                        height: "2rem",
                      }}
                    />
                    <p className="text-lg font-medium">
                      <a href={`/profile/${user.username}`}>{user.username}</a>
                    </p>
                    <p className="text-sm text-gray-600">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {searchResults.posts.length > 0 && (
              <div className="posts-results mb-6">
                <h2 className="text-xl font-bold mb-2">Posts</h2>
                {searchResults.posts.map((post, index) => (
                  <div
                    key={index}
                    className="post-card border p-2 rounded mb-2"
                  >
                    <h3 className="font-semibold text-lg">
                      <a href={`/post/${post.id}`}>{post.title}</a>
                    </h3>
                    <p className="text-sm text-gray-600">{post.full_author}</p>
                  </div>
                ))}
              </div>
            )}

            {searchResults.articles.length > 0 && (
              <div className="results-section">
                <div className="articles-results">
                  <h2 className="text-xl font-bold mb-2">Articles</h2>
                  {searchResults.articles.map((article, index) => (
                    <div
                      key={index}
                      className="article-card border p-2 rounded mb-2"
                    >
                      <h3 className="font-semibold text-lg">
                        <a href={`/article/${article.id}`}>{article.title}</a>
                      </h3>
                      <p className="text-sm text-gray-600">
                        {article.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {searchResults &&
          searchResults.users.length === 0 &&
          searchResults.posts.length === 0 &&
          searchResults.articles.length === 0 && <div>No results found</div>}
      </div>
    </div>
  );
};

export default SearchPage;
