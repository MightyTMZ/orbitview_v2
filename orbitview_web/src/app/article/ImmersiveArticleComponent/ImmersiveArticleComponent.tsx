"use client";
// because its immersive, it will be client

import React, { useState } from "react";
import "./ImmersiveArticleComponent.css";
import { backendServer } from "@/importantLinks";
import { useRouter } from "next/navigation";

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
  title: string;
  content: string;
  author: Author;
  created_at: string;
  immersiveSettings?: {
    fontSize?: string;
    fontFamily?: string;
    contrast?: "normal" | "high" | "low";
    stereoscopic?: boolean;
  };
}

const ImmersiveArticleComponent: React.FC<ArticleProps> = ({
  title,
  content,
  author,
  created_at,
  immersiveSettings = {
    fontSize: "1rem",
    fontFamily: "Arial, sans-serif",
    contrast: "normal",
    stereoscopic: true,
  },
}) => {
  const [settings, setSettings] = useState(immersiveSettings);
  // const [loading, setLoading] = useState(true);

  /*if (loading) {
    return <Spinner />;
  } */

  const router = useRouter();

  const handleSettingChange = (
    setting: keyof typeof settings,
    value: string | boolean
  ) => {
    setSettings({ ...settings, [setting]: value });
  };

  // setTimeout(() => setLoading(false), 1000);

  return (
    <div
      className={`article-container ${
        settings.stereoscopic ? "stereoscopic-mode" : ""
      }`}
      style={{
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
      }}
    >
      {/* Toolbar for Immersive Settings */}
      <div className="toolbar">
        <label>
          Font Size:
          <select
            value={settings.fontSize}
            onChange={(e) => handleSettingChange("fontSize", e.target.value)}
          >
            <option value="1rem">Default</option>
            <option value="1.2rem">Large</option>
            <option value="1.5rem">Extra Large</option>
          </select>
        </label>
        <label>
          Font Family:
          <select
            value={settings.fontFamily}
            onChange={(e) => handleSettingChange("fontFamily", e.target.value)}
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
          </select>
        </label>
        <label>
          Contrast:
          <select
            value={settings.contrast}
            onChange={(e) => handleSettingChange("contrast", e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </label>
        <label>
          Stereoscopic Mode:
          <input
            type="checkbox"
            checked={settings.stereoscopic}
            onChange={(e) =>
              handleSettingChange("stereoscopic", e.target.checked)
            }
          />
        </label>
      </div>

      {/* Article Content */}
      <article className={`article-content contrast-${settings.contrast}`}>
        <h1 className={`${settings.stereoscopic ? "orbitViewTitle" : ""}`}>
          {title}
        </h1>
        <header>
          <div
            className={`author-info ${
              settings.stereoscopic ? "orbitViewText" : ""
            }`}
          >
            <p>
              Written by {author.first_name} {author.last_name}
            </p>
            <img
              src={`${backendServer}/${author.profile.image}`}
              alt={`${author.first_name} ${author.last_name}`}
              onClick={() =>
                router.push(`/profile/${author.username}/articles/`)
              }
            />
            <p>
              <span
                onClick={() =>
                  router.push(`/profile/${author.username}/articles/`)
                }
                className="authorByName"
              >
                {author.first_name} {author.last_name}
              </span>
              - {new Date(created_at).toLocaleDateString()}
            </p>
          </div>
        </header>
        <hr />
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className={`${settings.stereoscopic ? "orbitViewText" : ""}`}
        />
        <footer className="article-footer">OrbitView</footer>
      </article>
    </div>
  );
};

export default ImmersiveArticleComponent;
