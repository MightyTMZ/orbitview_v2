import React from "react";
import { backendServer } from "@/components/importantLinks";

export default async function VideosRetrieve() {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${backendServer}/content/videos/`, {
    cache: "no-store",
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });

  if (!response.ok) {
    return <div>Not signed in, please sign in to view posts on OrbitView</div>;
  } else {
    const data = await response.json();

    const videos = data;

    return <div>{videos}</div>;
  }
}
