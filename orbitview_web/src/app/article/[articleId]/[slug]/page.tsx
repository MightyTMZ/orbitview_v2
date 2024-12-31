"use client";

import React from "react";
import { useParams } from "next/navigation";
import TraditionalArticleComponent from "../../TraditionalArticleComponent/TraditionalArticleComponent";

const page = () => {
  const params = useParams();

  if (!params) {
    return <div>Loading...</div>;
  }

  const articleId = params.articleId;
  const slug = params.slug;

  if (!articleId || !slug) {
    return <div>Error: Missing parameters.</div>;
  }

  const numericId = Number(articleId);
  const stringSlug = String(slug);

  if (isNaN(numericId)) {
    return <div>Error: Invalid article ID.</div>;
  }

  return (
    <div>
      <TraditionalArticleComponent id={numericId} slug={stringSlug} />
    </div>
  );
};

export default page;
