"use client";
// because its immersive, it will be client

import React, { useState, useEffect } from "react";
import "./ImmersiveArticleComponent.css";
import { backendServer } from "@/importantLinks";
import { useRouter } from "next/navigation";
import { formatDate } from "../formattingDate";
import { IoClose } from "react-icons/io5";
import { CiMenuBurger } from "react-icons/ci";

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
    sticky?: boolean;
    closed?: boolean;
  };
}

const ImmersiveArticleComponent: React.FC<ArticleProps> = ({
  title,
  content,
  author,
  created_at,
  immersiveSettings = {
    fontSize: "1rem",
    fontFamily: "System UI Font",
    contrast: "normal",
    stereoscopic: true,
    sticky: true,
  },
}) => {
  const [settings, setSettings] = useState(immersiveSettings);
  const [isToolbarClosed, setIsToolbarClosed] = useState(false);

  const toggleToolbar = () => {
    setIsToolbarClosed((prev) => !prev);
  };

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

  // setTimeout(() => setLoading(false), 1000); load the ads

  const htmlElement = document.getElementsByTagName("html")[0];

  useEffect(() => {
    // Set the contrast class on the html element based on settings.contrast
    htmlElement.classList.remove(
      "contrast-normal",
      "contrast-high",
      "contrast-low"
    );
    htmlElement.classList.add(`contrast-${settings.contrast}`);
  }, [settings.contrast]);

  return (
    <div
      className={`article-container contrast-${settings.contrast} ${
        settings.stereoscopic ? "stereoscopic-mode" : ""
      }`}
      style={{
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
      }}
    >
      <div className={`toolbar ${settings.sticky ? "toolbar-sticky" : ""}`}>
        {!isToolbarClosed ? (
          <>
            <IoClose
              title="Close toolbar"
              height={32}
              onClick={toggleToolbar}
            />
            <label>
              Font Size:
              <select
                value={settings.fontSize}
                onChange={(e) =>
                  handleSettingChange("fontSize", e.target.value)
                }
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
                onChange={(e) =>
                  handleSettingChange("fontFamily", e.target.value)
                }
              >
                <option value="Arial, sans-serif" className="arial">
                  Arial
                </option>
                <option value="Baskerville" className="baskerville">
                  Baskerville
                </option>
                <option value="Bodoni" className="bodoni">
                  Bodoni
                </option>
                <option
                  value="'Courier New', monospace"
                  className="courier-new"
                >
                  Courier New
                </option>
                <option value="EB Garamond" className="garamond">
                  EB Garamond
                </option>
                <option value="Helvetica" className="helvetica">
                  Helvetica
                </option>
                <option value="IBM Plex Sans" className="ibm_plex_sans">
                  IBM Plex Sans
                </option>
                <option value="Lexend" className="lexend">
                  Lexend
                </option>
                <option value="Montserrat" className="montserrat">
                  Montserrat
                </option>
                <option value="Oswald" className="oswald">
                  Oswald
                </option>
                <option value="Orbitron" className="orbitron">
                  Orbitron
                </option>
                <option value="Poppins" className="poppins">
                  Poppins
                </option>
                <option value="Roboto" className="roboto">
                  Roboto
                </option>
                <option
                  value="System UI Font"
                  className="system_default_ui_font"
                >
                  System Default UI
                </option>
                <option value="Times New Roman" className="times-new-roman">
                  Times New Roman
                </option>
                <option value="Verdana" className="verdana">
                  Verdana
                </option>
              </select>
            </label>
            <label>
              Contrast:
              <select
                value={settings.contrast}
                onChange={(e) =>
                  handleSettingChange("contrast", e.target.value)
                }
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
            <label>
              Sticky Toolbar:
              <input
                type="checkbox"
                checked={settings.sticky}
                onChange={(e) =>
                  handleSettingChange("sticky", e.target.checked)
                }
              />
            </label>
          </>
        ) : (
          <CiMenuBurger
            title="Open toolbar"
            height={32}
            onClick={toggleToolbar}
          />
        )}
      </div>
      {/* Article Content */}
      <article className={`article-content contrast-${settings.contrast}`}>
        <h1 className={`${settings.stereoscopic ? "orbitViewTitle" : ""}`}>
          {title}
        </h1>
        <p className="publish-date">
          {formatDate(new Date(created_at).toLocaleDateString())}
        </p>
        <header>
          <div
            className={`author-info mb-3 ${
              settings.stereoscopic ? "orbitViewText" : ""
            }`}
          >
            <img
              src={`${backendServer}/${author.profile.image}`}
              alt={`${author.first_name} ${author.last_name}`}
              title={`View ${author.first_name} ${author.last_name}`}
              className="profilePicture mr-2"
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
                title={`View ${author.first_name} ${author.last_name}`}
              >
                {author.first_name} {author.last_name}
              </span>
              <p>{author.profile.by_line}</p>
            </p>
          </div>
        </header>
        <hr />
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className={`${settings.stereoscopic ? "orbitViewText mt-3" : "mt-3"}`}
        />
        <footer className="article-footer"></footer>
      </article>
    </div>
  );
};

export default ImmersiveArticleComponent;
