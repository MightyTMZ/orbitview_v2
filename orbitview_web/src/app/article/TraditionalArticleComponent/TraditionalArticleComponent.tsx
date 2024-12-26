import React, { useEffect, useState } from "react";
import { backendServer } from "@/importantLinks";
import styles from "./TraditionalArticle.module.css";
import Link from "next/link";
import Spinner from "@/components/Spinner/Spinner";

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

// takes in only the id parameter
const TraditionalArticleComponent: React.FC<ArticleProps> = ({ id }) => {
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
      {/*<Helmet>
        <title>{article.title} | OrbitView</title>
        <meta name="description" content={`${article.title} by ${article.author.first_name} ${article.author.last_name}`} />
        <meta name="author" content={`${article.author.first_name} ${article.author.last_name}`} />
        <meta name="keywords" content="OrbitView, articles, immersive, technology" />
      </Helmet>*/}

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
        <Link href={`/article/${id}/immersive`}>Read in immersive </Link>
      </header>

      <section
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: article.content }}
      ></section>

      <footer className={styles.footer}>
        <p>
          <strong>Likes:</strong> {article.likes_count} |{" "}
          <strong>Shares:</strong> {article.shares_count} |{" "}
          <strong>Saves:</strong> {article.saves_count}
        </p>
      </footer>
    </article>
  );
};

export default TraditionalArticleComponent;
