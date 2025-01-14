"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import ArticleCard from "@/app/profile/[username]/ArticleCard";
import { backendServer } from "@/importantLinks";
import { FaSearch } from "react-icons/fa";
import styles from "./HomeFeed.module.css";

const INDUSTRIES = [
  ["technology", "Technology"],
  ["finance", "Finance"],
  ["healthcare", "Healthcare"],
  ["education", "Education"],
];

const HomeFeed = () => {
  const [industry, setIndustry] = useState("All");
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchEndpoint = useMemo(() => {
    return industry === "All"
      ? `?page=${page}`
      : `?author__profile__industry=${industry}&page=${page}`;
  }, [industry, page]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!hasMore || loading) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${backendServer}/content/articles/${fetchEndpoint}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          setArticles((prev) => prev.concat(data.results));
          setHasMore(data.next !== null);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [industry, page]); // Removed `articles` from the dependency array

  const handleIndustryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setIndustry(e.target.value);
      setPage(1);
      setArticles([]);
      setHasMore(true);
    },
    []
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  }, [loading, hasMore]);

  return (
    <div className={styles["home-feed"]}>
      <label htmlFor="industry-select">Find content in:</label>
      <select
        id="industry-select"
        value={industry}
        onChange={handleIndustryChange}
        style={{
          padding: "10px",
          margin: "10px 0",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        <option value="All">All</option>
        {INDUSTRIES.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className={`${styles.searchIcon} mt-6 mb-6`}>
        <span>
          Can&apos;t find something?{" "}
          <a href="/search" style={{ display: "inline-flex", gap: "0.5rem" }}>
            Try search <FaSearch />
          </a>
        </span>
      </div>

      <div>
        {articles.length === 0 && !loading ? (
          <p>No articles found.</p>
        ) : (
          articles.map((article, key) => (
            <div className={styles.articleBox} key={key}>
              <ArticleCard article={article} />
            </div>
          ))
        )}
      </div>

      {loading && <p>Loading...</p>}

      {hasMore && !loading && (
        <button onClick={loadMore} style={{ marginTop: "20px" }}>
          Load More
        </button>
      )}
    </div>
  );
};

export default HomeFeed;
