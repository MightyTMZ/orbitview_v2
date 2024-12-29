"use client";

import React, { useState } from "react";
import styles from "./Search.module.css";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/search/?query=${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
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
            setQuery(e.target.value);
          }}
          placeholder="Search for users, posts, or articles"
          className={styles["search-input"]}
        />
        <button onClick={handleSearch} className={styles["search-button"]}>
          Search
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="search-results">
        {searchResults && (
          <>
            {searchResults.profiles.length > 0 && (
              <div className="results-section">
                <h3>Users</h3>
                <ul>
                  {searchResults.profiles.map((profile) => (
                    <li key={profile.user.username}>
                      {profile.user.first_name} {profile.user.last_name} (@
                      {profile.user.username})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {searchResults.posts.length > 0 && (
              <div className="results-section">
                <h3>Posts</h3>
                <ul>
                  {searchResults.posts.map((post, idx) => (
                    <li key={idx}>{post.title}</li>
                  ))}
                </ul>
              </div>
            )}

            {searchResults.articles.length > 0 && (
              <div className="results-section">
                <h3>Articles</h3>
                <ul>
                  {searchResults.articles.map((article, idx) => (
                    <li key={idx}>{article.title}</li>
                  ))}
                </ul>
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
