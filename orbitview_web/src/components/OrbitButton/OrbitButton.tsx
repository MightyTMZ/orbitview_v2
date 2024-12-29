'use client'

import { useState } from "react";
import './OrbitButton.css';


interface Props {
  text: string;
  hoverText: string;
  endpoint: string;
}


const OrbitButton = (props: Props) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="btn poppins"
      id="register-btn"
      onClick={() => (window.location.href = `${props.endpoint}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ fontSize: "1.25rem" }}
    >
      {hovered ? `${props.hoverText}` : `${props.text}`}
    </button>
  );
};

export default OrbitButton;