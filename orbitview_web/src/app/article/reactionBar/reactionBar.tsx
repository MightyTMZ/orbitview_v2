import React, { useState } from "react";
import styles from "./ReactionBar.module.css";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaShareSquare } from "react-icons/fa";

interface ReactionBarProps {
  liked: boolean;
  saved: boolean;
  likesCount: number;
  sharesCount: number;
  savesCount: number;
  onReact: (type: "like" | "share" | "save") => void;
}

const ReactionBar: React.FC<ReactionBarProps> = ({
  liked,
  saved,
  likesCount,
  // sharesCount,
  savesCount,
  onReact,
}) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [isSaved, setIsSaved] = useState(saved);
  const [likes, setLikes] = useState(likesCount);
  // const [shares, setShares] = useState(sharesCount);
  const [saves, setSaves] = useState(savesCount);

  // const iconSize = 30;

  const handleReaction = (type: "like" | "share" | "save") => {
    if (type === "like") {
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1); // Toggle like count
    }
    if (type === "share") {
      // setShares(shares + 1); // Increment share count
    }
    if (type === "save") {
      setIsSaved(!isSaved);
      setSaves(isSaved ? saves - 1 : saves + 1); // Toggle save count
    }
    onReact(type); // Notify parent of the reaction
  };

  return (
    <div className={styles.reactionBar}>
      {/* Like Button */}
      <button
        className={`${styles.reactionButton} ${isLiked ? styles.active : ""}`}
        onClick={() => handleReaction("like")}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        {isLiked ? "❤️" : "🤍"} Like{" "}
        <span className={styles.count}>{likes}</span>
      </button>

      {/* Share Button */}
      <button
        className={styles.reactionButton}
        onClick={() => handleReaction("share")}
        aria-label="Share"
      >
        🔗 Share <span className={styles.count}></span>
      </button>

      {/* Save Button */}
      <button
        className={`${styles.reactionButton} ${isSaved ? styles.active : ""}`}
        onClick={() => handleReaction("save")}
        aria-label={isSaved ? "Unsave" : "Save"}
      >
        {isSaved ? "📖" : "📌"} Save{" "}
        <span className={styles.count}>{saves}</span>
      </button>
    </div>
  );
};

export default ReactionBar;
