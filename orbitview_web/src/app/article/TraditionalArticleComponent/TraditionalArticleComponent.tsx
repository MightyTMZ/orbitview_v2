import React, { useEffect, useState } from "react";
import { backendServer } from "@/importantLinks";
import styles from "./TraditionalArticle.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner/Spinner";
import ReactionBar from "../reactionBar/reactionBar";

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
}

const TraditionalArticleComponent: React.FC<ArticleProps> = ({ id }) => {
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
          `${backendServer}/content/articles/${id}/`
        );
        if (!response.ok) throw new Error("Failed to fetch article.");
        const data = await response.json();
        setArticle(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleReaction = async (type: "like" | "share" | "save") => {
    try {
      const response = await API.post(`/content/articles/${id}/${type}/`);
      if (type === "like") {
        setLikedArticle((prev) => !prev);
      } else if (type === "save") {
        setSavedArticle((prev) => !prev);
      } else if (type === "share") {
        console.log("The user wants to share the article.");
      }

      if (response.status === 401 || response.status == 403) {
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
          />
          <p>
            By{" "}
            <strong>
              {article.author.first_name} {article.author.last_name}
            </strong>{" "}
            | Published on {new Date(article.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          className="mt-3"
          style={{
            padding: "5px",
            border: "1px solid black",
          }}
          onClick={() => router.push(`${id}/immersive`)}
        >
          Read in immersive
        </button>

        <ReactionBar
          liked={likedArticle}
          saved={savedArticle}
          likesCount={article.likes_count}
          sharesCount={article.shares_count}
          savesCount={article.saves_count}
          onReact={handleReaction}
        />
      </header>

      <section
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: article.content }}
      ></section>

      <footer className={styles.footer}></footer>
    </article>
  );
};

export default TraditionalArticleComponent;
