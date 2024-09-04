"use client";

import React, { useState, useEffect } from "react";

const Page = ({
  params,
}: {
  params: { type: string; id: string; season: string; episode: string };
}) => {
  const { type, id, season, episode } = params;
  const [selectedApi, setSelectedApi] = useState("vidsrc");
  const [loading, setLoading] = useState(false);

  const getIframeSrc = () => {
    let iframeSrc = "";
    if (selectedApi === "vidsrc") {
      iframeSrc =
        type === "movie"
          ? `https://vidsrc.xyz/embed/movie/${id}`
          : type === "tv"
          ? `https://vidsrc.xyz/embed/tv?imdb=${id}&season=${season}&episode=${episode}`
          : "";
    } else if (selectedApi === "multiembed") {
      iframeSrc =
        type === "movie"
          ? `https://multiembed.mov/?video_id=${id}`
          : type === "tv"
          ? `https://multiembed.mov/?video_id=${id}&s=${season}&e=${episode}`
          : "";
    }

    return iframeSrc;
  };

  useEffect(() => {
    // Set loading to true when API changes
    setLoading(true);

    // Simulate a delay for loading (e.g., waiting for iframe to load)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, [selectedApi]);

  return (
    <div>
      <div className="w-full h-[80vh] px-[2vw] flex items-center justify-center">
        {loading ? (
          <div className="loader"></div> // Spinner while loading
        ) : (
          <iframe
            className="w-full h-full"
            src={getIframeSrc()}
            allowFullScreen
          />
        )}
      </div>
      <div className="flex h-10 px-[2vw] flex-row mt-4 gap-3 items-center justify-center">
        <button
          className={`h-full pl-5 pr-5 rounded text-black ${
            selectedApi === "vidsrc"
              ? "bg-yellow-700"
              : "bg-yellow-500 hover:bg-yellow-700"
          }`}
          onClick={() => setSelectedApi("vidsrc")}
        >
          Vidsrc
        </button>
        <button
          className={`h-full pl-5 pr-5 rounded text-black ${
            selectedApi === "multiembed"
              ? "bg-yellow-700"
              : "bg-yellow-500 hover:bg-yellow-700"
          }`}
          onClick={() => setSelectedApi("multiembed")}
        >
          Multiembed
        </button>
      </div>
    </div>
  );
};

export default Page;
