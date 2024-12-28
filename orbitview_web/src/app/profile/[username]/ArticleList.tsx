import React from "react";
import ArticleCard from "./ArticleCard"; // Assuming the individual card is in a separate file

interface Profile {
  image: string;
  by_line: string;
  is_online: string;
}

interface Author {
  id: number;
  first_name: string;
  last_name?: string;
  profile: Profile;
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

interface Props {
  articles: Article[];
}

const ArticleList = ({ articles }: Props) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-left py-10 text-gray-500">
        <p>No articles available at the moment. 😞</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;
