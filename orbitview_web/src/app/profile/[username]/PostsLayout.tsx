import React from "react";
import styles from "./PostLayout.module.css";

const PostsLayout = () => {
  return (
    <div>
      <div className={styles["posts-grid"]}>
        <div className={styles["post-card"]}>
          <div className={styles["post-details"]}>
            <h3 className={styles["post-title"]}>
              Learning Accounting: Tips for Beginners
            </h3>
            <span className={styles["post-type"]}>Post</span>
            <div className={styles["post-engagement"]}>
              <span>👍 120</span>
              <span>💬 45</span>
              <span>🔗 20</span>
            </div>
          </div>
          <button className={styles["post-action"]}>View</button>
        </div>
        <div className={styles["post-card"]}>
          <div className={styles["post-details"]}>
            <h3 className={styles["post-title"]}>
              Learning Accounting: Tips for Beginners
            </h3>
            <span className={styles["post-type"]}>Post</span>
            <div className={styles["post-engagement"]}>
              <span>👍 120</span>
              <span>💬 45</span>
              <span>🔗 20</span>
            </div>
          </div>
          <button className={styles["post-action"]}>View</button>
        </div>

        <div className={styles["post-card"]}>
          <div className={styles["post-details"]}>
            <h3 className={styles["post-title"]}>
              Learning Accounting: Tips for Beginners
            </h3>
            <span className={styles["post-type"]}>Post</span>
            <div className={styles["post-engagement"]}>
              <span>👍 120</span>
              <span>💬 45</span>
              <span>🔗 20</span>
            </div>
          </div>
          <button className={styles["post-action"]}>View</button>
        </div>

        <div className={styles["post-card"]}>
          <div className={styles["post-details"]}>
            <h3 className={styles["post-title"]}>
              Learning Accounting: Tips for Beginners
            </h3>
            <span className={styles["post-type"]}>Post</span>
            <div className={styles["post-engagement"]}>
              <span>👍 120</span>
              <span>💬 45</span>
              <span>🔗 20</span>
            </div>
          </div>
          <button className={styles["post-action"]}>View</button>
        </div>

        <div className={styles["post-card"]}>
          <div className={styles["post-details"]}>
            <h3 className={styles["post-title"]}>
              Learning Accounting: Tips for Beginners
            </h3>
            <span className={styles["post-type"]}>Post</span>
            <div className={styles["post-engagement"]}>
              <span>👍 120</span>
              <span>💬 45</span>
              <span>🔗 20</span>
            </div>
          </div>
          <button className={styles["post-action"]}>View</button>
        </div>

        <div className={styles["post-card"]}>
          <div className={styles["post-details"]}>
            <h3 className={styles["post-title"]}>
              Learning Accounting: Tips for Beginners
            </h3>
            <span className={styles["post-type"]}>Post</span>
            <div className={styles["post-engagement"]}>
              <span>👍 120</span>
              <span>💬 45</span>
              <span>🔗 20</span>
            </div>
          </div>
          <button className={styles["post-action"]}>View</button>
        </div>
      </div>
    </div>
  );
};

export default PostsLayout;
