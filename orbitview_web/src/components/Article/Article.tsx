import React from "react";
import styles from "./ImmersiveReader.module.css";

interface User {
  username: string; // unique for all users
  first_name: string;
  last_name?: string;
  profile_pic: string;
}

interface Author {
  id: number;
  first_name: string;
  last_name?: string;
  user: User;
}

interface Blog {
  // e.g. OrbitView AI, OrbitView AR
  id: string;
  title: string;
  hidden: boolean;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  blog?: Blog | null;
  authors: Author[];
  content: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  featured_image: string;
  label: string;
}

interface Props {
  article: Article;
}




const Article = ({ article }: Props) => {

  // export meta data such as `metadata: {article.title}` etc.

  // the default font for OrbitView is Poppins

  return (
    <div
      className={styles["immersive-reader"]}
      style={{
        fontFamily: "Poppins",
      }}
    >
      <div className={styles["article-header"]}>
        <img
          src={article.featured_image}
          alt={article.title}
          className={styles["featured-image"]}
        />
        <h1 className={styles["title"]}>{article.title}</h1>
        <h2 className={styles["subtitle"]}>{article.subtitle}</h2>
      </div>
      <div className={styles["authors"]}>
        {article.authors.map((author) => (
          <div key={author.id} className={styles["author"]}>
            <img
              src={author.user.profile_pic}
              alt={author.user.username}
              className={styles["profile-pic"]}
            />
            <span className={styles["author-name"]}>
              {author.first_name} {author.last_name || ""}
            </span>
          </div>
        ))}
      </div>
      <div
        className={styles["content"]}
        dangerouslySetInnerHTML={{ __html: article.content }}
      ></div>
    </div>
  );
};

export default Article;
