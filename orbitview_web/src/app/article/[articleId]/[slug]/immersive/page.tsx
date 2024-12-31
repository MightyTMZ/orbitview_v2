"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { backendServer } from "@/importantLinks";
import ImmersiveArticleComponent from "@/app/article/ImmersiveArticleComponent/ImmersiveArticleComponent";

const ImmersiveArticlePage: React.FC = () => {
  const params = useParams();

  const articleId = Number(params.articleId);
  const slug = String(params.slug);

  const fetchEndpoint = `${backendServer}/content/articles/${articleId}/${slug}`; // do not put the trailing slash
  console.log(fetchEndpoint)

  const [article, setArticle] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (articleId && slug) {
      const fetchArticle = async () => {
        try {
          const response = await fetch(fetchEndpoint);
          if (!response.ok) throw new Error("Failed to fetch article.");
          const data = await response.json();

          setArticle(data);
          console.log(article);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [articleId, slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
