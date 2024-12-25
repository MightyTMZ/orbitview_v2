"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TraditionalArticleComponent from "../TraditionalArticleComponent/TraditionalArticleComponent";

const page = () => {
  const { articleId } = useParams();

  console.log(typeof articleId);

  // Handle the case where `articleId` is undefined on the first render
  if (!articleId) {
    return <div>Loading...</div>;
  }

  const numericId = Number(articleId);

  if (isNaN(numericId)) {
    return <div>Error: Invalid article ID.</div>;
  }

  // Convert `articleId` to a number

  return (
    <div>
      {/*<h1>this is article {articleId}</h1> */}
      <TraditionalArticleComponent id={numericId} />
    </div>
  );
};

export default page;
