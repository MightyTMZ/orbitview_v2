"use client";

import React, { useState } from "react";
import styles from "./Search.module.css";
import { backendServer } from "@/importantLinks";
import { ReactTyped } from "react-typed";
// import Image from "next/image";

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
  slug: string;
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
  by_line: string;
  image: string;
}

interface SearchResult {
  users: User[];
  posts: Post[];
  articles: Article[];
}

/*const industries = [
  "All",
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Entertainment",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Travel",
  "Other",
];*/

const SearchPage = () => {
  const lastSearchQuery = localStorage.getItem("lastSearchQuery");

  const [query, setQuery] = useState(lastSearchQuery ? lastSearchQuery : "");
  // const [selectedIndustry, setSelectedIndustry] = useState("---");
  const [searchResults, setSearchResults] = useState<SearchResult>({
    users: [],
    posts: [],
    articles: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query: string) => {
    localStorage.setItem("lastSearchQuery", query);

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message); // If it's an Error instance, access the message
      } else {
        console.error("An unknown error occurred."); // Handle non-Error instances
      }
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
            setQuery(e.target.value);
            if (query.length > 0) {
              handleSearch(query);
            }
          }}
          placeholder="Search for users, posts, or articles"
          className={styles["search-input"]}
        />

        {/*<select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className={styles["industry-dropdown"]}
        >
          <option value="">All Industries</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select> */}

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
                <h2 className="text-xl font-bold mb-2">Accounts</h2>
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
                      <a href={`/profile/${user.username}`}>
                        {user.first_name} {user.last_name}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">{user.by_line}</p>
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
                        <a href={`/article/${article.id}/${article.slug}`}>
                          {article.title}
                        </a>
                      </h3>
                      <p className="text-sm text-gray-600">
                        {article.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div
              className="for-ads"
              style={{
                height: "100vh",
              }}
            ></div>
          </>
        )}

        {query.length == 0 ? (
          <div>
            <p className={styles["search-typed"]}>
              <ReactTyped
                strings={[
                  "Search for people",
                  "Search for posts",
                  "Search for articles",
                  /*"Explore people building in Web3 and AI",
                  "Search for growth tools and strategies",
                  "Discover posts about career transitions",
                  "Search for Gen Z-friendly investment tips",
                  "Find advice on networking and building connections",
                  "Discover unique stories from first-time founders",
                  "Search for people leading social impact startups",
                  "Explore posts on overcoming startup challenges",
                  "Search for people redefining industries",
                  "Find posts on mental resilience for entrepreneurs",
                  "Search for articles on mastering side hustles",
                  "Discover creators reshaping the future",*/
                ]}
                typeSpeed={40}
                backSpeed={50}
                loop
              ></ReactTyped>
            </p>

            <p>
              Learn more about searching on OrbitView{" "}
              <a
                href="/search-guide"
                style={{
                  color: "blue",
                }}
              >
                here
              </a>
            </p>
            <div
              className="for-ads"
              style={{
                height: "100vh",
              }}
            ></div>
          </div>
        ) : (
          <></>
        )}

        {query.length > 0 &&
          searchResults &&
          searchResults.users.length === 0 &&
          searchResults.posts.length === 0 &&
          searchResults.articles.length === 0 && <div>No results found</div>}
      </div>
    </div>
  );
};

export default SearchPage;
