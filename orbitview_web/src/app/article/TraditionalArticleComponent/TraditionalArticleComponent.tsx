"use client";

import React, { useEffect, useState } from "react";
import { backendServer } from "@/importantLinks";
import styles from "./TraditionalArticle.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";
import Spinner from "@/components/Spinner/Spinner";
import ReactionBar from "../reactionBar/reactionBar";
import { formatDate } from "../formattingDate";

interface Author {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile: {
    image: string;
    by_line: string;
    is_online: boolean;
  };
}

interface ArticleProps {
  id: number; // Article ID for fetching the data
  slug: string;
}

const TraditionalArticleComponent: React.FC<ArticleProps> = ({ id, slug }) => {
  const dispatch = useDispatch();

  const router = useRouter();

  const [article, setArticle] = useState<null | {
    title: string;
    content: string;
    author: Author;
    created_at: string;
    likes_count: number;
    shares_count: number;
    saves_count: number;
  }>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedArticle, setLikedArticle] = useState(false);
  const [savedArticle, setSavedArticle] = useState(false);
  // Set up Axios instance
  const API = axios.create({
    baseURL: backendServer,
    withCredentials: true,
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

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `${backendServer}/content/articles/${id}/${slug}`
        );
        if (!response.ok) throw new Error("Failed to fetch article.");
        const data = await response.json();
        setArticle(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message); // If it's an Error instance, access the message
        } else {
          setError("An unknown error occurred."); // Handle non-Error instances
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, slug]);

  const handleReaction = async (type: "like" | "share" | "save") => {
    try {
      const response = await API.post(`/content/articles/${id}/${type}/`);

      if (response.status === 401) {
        alert("Please log into your account to interact with this post.");
        dispatch(logout());
        localStorage.setItem("currentContent", window.location.href);
        window.location.href = "/login/"; // Redirect to login page
        return; // Stop execution here if the user is unauthorized
      }

      if (type === "like") {
        setLikedArticle((prev) => !prev);
      } else if (type === "save") {
        setSavedArticle((prev) => !prev);
      } else if (type === "share") {
        console.log("The user wants to share the article.");
      }

      if (response.status === 401 || response.status === 403) {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error handling reaction to article: ", error);
    }
  };

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await API.get(`/content/articles/${id}/like/`);
        setLikedArticle(response.data.liked === "liked");
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    const fetchSaveStatus = async () => {
      try {
        const response = await API.get(`/content/articles/${id}/save/`);
        setSavedArticle(response.data.saved === "saved");
      } catch (error) {
        console.error("Error fetching saved status:", error);
      }
    };

    fetchLikeStatus();
    fetchSaveStatus();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!article) {
    return <div className={styles.error}>No article found.</div>;
  }

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <img
            src={`${backendServer}/${article.author.profile.image}/`}
            alt={`${article.author.first_name}'s profile`}
            className={styles.profileImage}
            title={`View ${article.author.first_name} ${article.author.last_name}`}
            onClick={() =>
              router.push(`/profile/${article.author.username}/articles/`)
            }
          />
          <p>
            <div
              title={`View ${article.author.first_name} ${article.author.last_name}`}
              onClick={() =>
                router.push(`/profile/${article.author.username}/articles/`)
              }
              className={styles.authorByName}
            >
              <strong>
                {article.author.first_name} {article.author.last_name}
              </strong>{" "}
            </div>
            | Published on{" "}
            {formatDate(new Date(article.created_at).toLocaleDateString())}
          </p>
        </div>
        <br />

        <ReactionBar
          liked={likedArticle}
          saved={savedArticle}
          likesCount={article.likes_count}
          sharesCount={article.shares_count}
          savesCount={article.saves_count}
          onReact={handleReaction}
        />
      </header>
      <button
        className={`mt-3 ${styles["immersive-button"]}`}
        style={{
          padding: "5px",
          border: "1px solid black",
          marginTop: "10px",
          marginBottom: "10px",
        }}
        onClick={() => router.push(`/article/${id}/${slug}/immersive`)}
      >
        Read in immersive mode
      </button>

      <section
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: article.content }}
      ></section>

      <footer className={styles.footer}></footer>
    </article>
  );
};

export default TraditionalArticleComponent;
