"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { backendServer } from "@/importantLinks";
import ImmersiveArticleComponent from "@/app/article/ImmersiveArticleComponent/ImmersiveArticleComponent";

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

interface Article {
  id: number;
  title: string;
  subtitle: string;
  author: Author;
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

const ImmersiveArticlePage: React.FC = () => {
  const params = useParams();

  const articleId = Number(params.articleId);
  const slug = String(params.slug);

  const fetchEndpoint = `${backendServer}/content/articles/${articleId}/${slug}`; // do not put the trailing slash

  const [article, setArticle] = useState<Article>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | Error>();

  useEffect(() => {
    if (articleId && slug) {
      const fetchArticle = async () => {
        try {
          const response = await fetch(fetchEndpoint);
          if (!response.ok) throw new Error("Failed to fetch article.");
          const data = await response.json();

          setArticle(data);
          console.log(article);
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
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
  }

  if (!article) {
    return <div>No article found.</div>;
  }

  return (
    <ImmersiveArticleComponent
      title={article.title}
      content={article.content}
      author={article.author}
      created_at={article.created_at}
    />
  );
};

export default ImmersiveArticlePage;
