"use client";
import React, { useEffect, useState } from "react";
import { AlertTriangle, Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
const HomeContents = () => {
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [content, setContent] = useState<string[]>([]);

  // Simulate data fetching
  useEffect(() => {
    const timeout = setTimeout(() => {
      const random = Math.random();

      if (random < 0.3) {
        setNetworkError(true);
      } else if (random < 0.6) {
        setContent([]); // Empty
      } else {
        setContent(["Recommended Track 1", "Playlist 2", "Album 3"]);
      }

      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const retry = () => {
    setLoading(true);
    setNetworkError(false);
    setContent([]);
    // Retry trigger
    setTimeout(() => {
      setContent(["New Track 1", "New Playlist"]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-6">
      {loading ? (
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader2 size={32} className="animate-spin text-velvet" />
          <p className="text-gray-400">Loading your music...</p>
        </div>
      ) : networkError ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <WifiOff size={36} className="text-red-500" />
          <p className="text-gray-400">
            Network error. Please check your connection.
          </p>
          <Button className="bg-velvet hover:bg-velvet/90" onClick={retry}>
            Retry
          </Button>
        </div>
      ) : content.length === 0 ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle size={36} className="text-yellow-400" />
          <p className="text-gray-400">
            No music content found. Start exploring or add new playlists.
          </p>
          <Button
            variant="outline"
            className="border-gray-600 text-white hover:border-white"
          >
            Explore Now
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-xl space-y-6">
          <h1 className="text-2xl font-semibold text-[--color-velvet]">
            Your Music Feed
          </h1>
          <ul className="space-y-3">
            {content.map((item, index) => (
              <li
                key={index}
                className="bg-dark-background border border-gray-700 rounded-lg p-4 hover:border-[--color-velvet] transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomeContents;
