'use client'

import React, { useState } from 'react';
import './LineFocus.css';

const LineFocus = () => {
  const [focusMode, setFocusMode] = useState(1);  // Focus on 1, 3, or 5 lines
  const [content] = useState([
    "Line 1: This is the first line of the article.",
    "Line 2: This is the second line.",
    "Line 3: This is the third line.",
    "Line 4: This is the fourth line.",
    "Line 5: This is the fifth line.",
    "Line 6: This is the sixth line.",
    "Line 7: This is the seventh line.",
    "Line 8: This is the eighth line.",
    "Line 9: This is the ninth line.",
    "Line 10: This is the tenth line."
  ]);

  const handleFocusChange = (event: any) => {
    setFocusMode(Number(event.target.value)); // Change focus mode based on user selection
  };

  return (
    <div className="line-focus-container">
      <div className="focus-options">
        <label>Focus Mode: </label>
        <select onChange={handleFocusChange} value={focusMode}>
          <option value={1}>1 Line</option>
          <option value={3}>3 Lines</option>
          <option value={5}>5 Lines</option>
        </select>
      </div>

      <div className="content">
        {content.map((line, index) => {
          // Determine the start and end index for the lines in focus based on focusMode
          const startLine = Math.floor(index / focusMode) * focusMode;
          const endLine = startLine + focusMode - 1;

          // Check if the current line is within the focus range
          const isFocused = index >= startLine && index <= endLine;

          return (
            <p
              key={index}
              className={isFocused ? 'focused' : 'non-focused'}
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default LineFocus;
