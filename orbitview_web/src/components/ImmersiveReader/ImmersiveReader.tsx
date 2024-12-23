"use client";

import React, { useState, useRef, useEffect } from "react";
import { availableFonts, availableFontSizes } from "./availableFont";
import { availableTextColors } from "./availableTextColors";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { FaHighlighter } from "react-icons/fa";
import { CiText } from "react-icons/ci";
import styles from "./ImmersiveReader.module.css";
import "../../app/fonts.css";
import { availableHighlightColors } from "./availableHighlightColors";

const mockUser = {};

interface User {
  username: string;
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

const minValues = {
  fontSize: 12,
  lineHeight: 0.5,
  contrast: 0,
  blur: 0,
  opacity: 0,
};

const maxValues = {
  fontSize: 12,
  lineHeight: 5,
  contrast: 0,
  blur: 10,
  opacity: 1,
};

const initialValues = {
  fontSize: 16,
  fontFamily: "poppins",
  textColor: "black",
  articleHighlightBGColor: "white",
  lineHeight: 1.25,
  contrast: 0,
  blur: 10,
  opacity: 1,
  stereoscopic: false,
};

const ImmersiveReader = ({ article }: Props) => {
  const [loading, setLoading] = useState(true);
  // text-related properties
  const [fontSize, setFontSize] = useState<number>(initialValues.fontSize); // State to control font size
  const [font, setFont] = useState(initialValues.fontFamily);
  const [lineHeight, setLineHeight] = useState(initialValues.lineHeight);
  const maxLineHeight = maxValues.lineHeight;
  const minLineHeight = minValues.lineHeight;
  const lineHeightSteps = 0.1;

  // for highlighting, underlining, boldening or italisizing, there will be a special toolbar
  // const [showTextToolbar, setShowTextToolbar] = useState(true);
  // const [selectedRange, setSelectedRange] = useState<Range | null>(null); // Explicitly set initial value to null

  const applyFormat = (
    format: "bold" | "italic" | "underline" | "highlight",
    color: string = currentHighlightColor
  ) => {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString(); // Get the selected text

      if (selectedText) {
        const span = document.createElement("span");
        span.textContent = selectedText;

        // Apply the corresponding styles to the span
        switch (format) {
          case "bold":
            span.style.fontWeight =
              span.style.fontWeight === "bold" ? "normal" : "bold";
            break;
          case "italic":
            span.style.fontStyle =
              span.style.fontStyle === "italic" ? "normal" : "italic";
            break;
          case "underline":
            span.style.textDecoration =
              span.style.textDecoration === "underline" ? "none" : "underline";
            break;
          case "highlight":
            span.style.backgroundColor =
              span.style.backgroundColor === color ? "" : color;
            break;
          default:
            break;
        }

        // Replace the selected text with the styled span
        range.deleteContents();
        range.insertNode(span);
      }
    }
  };

  const makeTextBold = () => {
    applyFormat("bold");
  };
  const makeTextItalic = () => {
    applyFormat("italic");
  };
  const makeTextUnderlined = () => {
    applyFormat("underline");
  };

  // const [highlightedText, setHighlightedText] = useState<string>(""); // State for selected text
  const [notes, setNotes] = useState<string[]>([]); // State to store notes
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  // const [bold, setBold] = useState(false);

  // Visual filters
  const [contrast, setContrast] = useState(initialValues.contrast);
  const [opacity, setOpacity] = useState(initialValues.opacity);
  const [stereoscopic, setStereoscopic] = useState(initialValues.stereoscopic);

  /* const lineReaderModes = [
    {
      id: 1,
      displayName: "Cursor Draggable",
      mode: "cursor-draggable",
      numberOfLines: 2,
    },
    {
      id: 2,
      displayName: "Line-by-Line",
      mode: "line-by-line",
      numberOfLines: [
        { id: 1, displayName: "1", value: 1, wordValue: "One" },
        { id: 2, displayName: "2", value: 2, wordValue: "Two" },
        { id: 3, displayName: "3", value: 3, wordValue: "Three" },
        { id: 4, displayName: "5", value: 5, wordValue: "Five" },
      ],
    },
  ];

  const [lineReaderMode, setLineReaderMode] = useState(lineReaderModes[0]); */

  // Important information for the reciever

  // For FUTURE USE CASES:

  /*const [priorityMedia, setPriorityMedia] =
    useState(null); /* the first thing a recieving 
  person would see when they open the article, it will be highlighted and the user can set it */

  /*
  const [comments, setComments] = useState([]); // an empty array of comments to begin
  const [highlights, setHighlights] = useState([]);
  const [underlinedText, setUnderlinedText] = useState([]);
  const [boldedText, setBoldedText] = useState([]); */

  const [
    isHighlightColorOptionsCollapsed,
    setIsHighlightColorOptionsCollapsed,
  ] = useState(true);
  const [currentHighlightColor, setCurrentHighlightColor] = useState("#FFF"); // white (this property is the background color of the article)

  const [
    isArticleTextColorOptionsCollapsed,
    setIsArticleTextColorOptionsCollapsed,
  ] = useState(true);
  const [currentArticleTextColor, setCurrentArticleTextColor] =
    useState("#000"); // black

  const resetSettings = () => {
    setFontSize(initialValues.fontSize);
    setFont(initialValues.fontFamily);
    setLineHeight(initialValues.lineHeight);
    setContrast(initialValues.contrast);
    setOpacity(initialValues.opacity);
    setStereoscopic(initialValues.stereoscopic);
    setCurrentArticleTextColor(initialValues.textColor);
    setCurrentHighlightColor(initialValues.articleHighlightBGColor);
  };

  return (
    <div
      className={`${styles["immersive-reader"]} ${font}`}
      style={{
        fontSize: `${fontSize}px`,
        backgroundColor: currentHighlightColor,
        opacity: opacity,
        color: currentArticleTextColor,
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

      {toolbarCollapsed ? (
        <>
          <div
            className={styles["toolbar"]}
            style={{
              justifyContent: "right",
            }}
          >
            <GiHamburgerMenu
              className={`${styles.toolbarToggle} ${styles.expandIconToolbar}`}
              onClick={() => setToolbarCollapsed(false)}
              height={32}
            />
            <h2>Toolbar</h2>
          </div>
        </>
      ) : (
        <div className={styles["toolbar"]}>
          <IoClose
            className={`${styles.toolbarToggle} ${styles.closeIconToolbar}`}
            onClick={() => setToolbarCollapsed(true)}
            title="Close toolbar"
            height={32}
          />
          <button
            onClick={() => {
              if (fontSize + 2 <= 32) {
                setFontSize((prev) => prev + 2);
              }
            }}
            title="Increase text size"
            className={styles.textIncrease}
          >
            A<sup>&uarr;</sup>
          </button>
          <button
            onClick={() => setFontSize((prev) => Math.max(prev - 2, 12))}
            title="Decrease text size"
            className={styles.textDecrease}
          >
            A<sub>&darr;</sub>
          </button>

          <select
            name="font-size"
            id="available-font-sizes"
            value={fontSize}
            className={styles.selectFont}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{
              fontFamily: "Arial",
            }}
          >
            {availableFontSizes.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>

          <select
            name="fonts"
            id="available-fonts"
            value={font}
            className={styles.selectFont}
            onChange={(e) => setFont(e.target.value)}
          >
            {availableFonts.map((font) => (
              <option
                key={font.id}
                value={font.styleClassName}
                className={`${styles.fontOption} ${font.styleClassName}`}
              >
                {font.displayName}
              </option>
            ))}
          </select>
          <div
            className={styles.highlightAdjust}
            onClick={() => {
              setIsHighlightColorOptionsCollapsed(false);
              setIsArticleTextColorOptionsCollapsed(true);
            }}
          >
            <FaHighlighter />
            <div
              style={{
                height: "10px",
                width: "auto",
                backgroundColor: currentHighlightColor, // Display the current highlight color
              }}
            ></div>
            {!isHighlightColorOptionsCollapsed && (
              <div className={styles.colorPalette}>
                {availableHighlightColors.map((color) => (
                  <div
                    key={color.id}
                    style={{
                      backgroundColor: color.colorCode,
                      borderRadius: "50%",
                      height: "30px",
                      width: "30px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setCurrentHighlightColor(color.colorCode); // Set the new highlight color
                      applyFormat("highlight", color.colorCode); // Apply the new highlight color
                    }}
                    title={color.colorName}
                  ></div>
                ))}
              </div>
            )}
          </div>
          <div
            className={styles.articleTextAdjust}
            onClick={() => {
              setIsArticleTextColorOptionsCollapsed(
                !isArticleTextColorOptionsCollapsed
              );
              setIsHighlightColorOptionsCollapsed(true);
            }}
          >
            <CiText />
            <div
              style={{
                height: "10px",
                width: "auto",
                backgroundColor: currentArticleTextColor,
              }}
            ></div>
            {!isArticleTextColorOptionsCollapsed && (
              <div className={styles.colorPalette}>
                {availableTextColors.map((color) => (
                  <div
                    key={color.id}
                    style={{
                      backgroundColor: color.colorCode,
                      borderRadius: "50%",
                      height: "30px",
                      width: "30px",
                      cursor: "pointer",
                      border:
                        color.colorName == "White" ? "1px solid #000" : "none",
                    }}
                    onClick={() => setCurrentArticleTextColor(color.colorCode)}
                    title={color.colorName}
                  ></div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.textToolbar}>
            <button
              title="Bold"
              style={{
                background: "white",
                color: "black",
                fontWeight: "bold",
              }}
              onClick={() => makeTextBold()}
            >
              B
            </button>
            <button
              title="Italic"
              style={{
                background: "white",
                color: "black",
              }}
              onClick={() => makeTextItalic()}
            >
              <i>I</i>
            </button>
            <button
              title="Underline"
              style={{
                background: "white",
                color: "black",
              }}
              onClick={() => makeTextUnderlined()}
            >
              <u>U</u>
            </button>
          </div>

          {/*<button onClick={addNote} disabled={!highlightedText}>
          Add Note
          </button>*/}
          <div className={styles.lineHeightAdjust}>
            <label htmlFor="lineHeightRange">Line Height:</label>
            <input
              type="range"
              id="lineHeightRange"
              name="lineHeight"
              min={minLineHeight}
              max={maxLineHeight}
              step={lineHeightSteps}
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
            />
            <input
              type="number"
              name="lineHeightNumber"
              min={minLineHeight}
              max={maxLineHeight}
              step={lineHeightSteps}
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
            />
          </div>

          <div className={styles.opacityAdjust}>
            <label htmlFor="opacityRange">Opacity:</label>
            <input
              type="range"
              id="opacityRange"
              name="opacity"
              min={0}
              max={100}
              step={1}
              value={String(Math.floor((opacity * 100) / 1))} // Corrected value to use parseInt
              onChange={(e) => setOpacity(parseInt(e.target.value, 10) / 100)} // Corrected to use parseInt
            />
            <input
              type="number"
              name="opacityNumber"
              min={0}
              max={100}
              step={1}
              value={String(Math.floor((opacity * 100) / 1))} // Corrected value to use parseInt
              onChange={(e) => setOpacity(parseInt(e.target.value, 10) / 100)} // Corrected to use parseInt
            />
          </div>
          <button onClick={() => resetSettings()}>Reset</button>

          <button onClick={() => console.log("Undo")}>Undo</button>
          <button onClick={() => console.log("Redo")}>Redo</button>
        </div>
      )}

      <div
        className={`${styles["content"]} ${font}`}
        style={{
          lineHeight: lineHeight,
          opacity: 1, // we dont want to change the text LMAO
          color: currentArticleTextColor,
        }}
        dangerouslySetInnerHTML={{ __html: article.content }}
        onClick={() => {
          setIsHighlightColorOptionsCollapsed(true);
          setIsArticleTextColorOptionsCollapsed(true);
        }}
      ></div>

      <div className={styles["notes-section"]}>
        <h3>Notes</h3>
        {notes.length > 0 ? (
          <ul>
            {notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        ) : (
          <p>No notes added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ImmersiveReader;
