import React from "react";

interface Props {
  contentType: string;
}

const ContentTypeComingSoon = ({ contentType }: Props) => {
  return (
    <div
      style={{
        marginTop: "80px",
        paddingBottom: "50px",
      }}
    >
      <h3
        style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}
      >
        {contentType} are coming soon on OrbitView
      </h3>
      <br />
      <p>Stay tuned for our release! 💫</p>
    </div>
  );
};

export default ContentTypeComingSoon;
