"use client";
import { Home, Search, Music, Plus as Playlist, Heart } from "lucide-react";
import { useState } from "react";

const TABS = [
  { id: "home", icon: Home, label: "Home" },
  { id: "search", icon: Search, label: "Search" },
  { id: "library", icon: Music, label: "Library" },
  { id: "playlist", icon: Playlist, label: "Playlists" },
  { id: "liked", icon: Heart, label: "Liked" },
];

const BottomBar = () => {
  const [activeTab, setActiveTab] = useState<string>("home");

  return (
    <div className="sm:hidden block pt-10">
      <div className="fixed bottom-0 left-0 right-0 bg-dark-background text-white shadow-lg py-2 px-4 flex  justify-between items-center border-t border-gray-700">
        {TABS.map(({ id, icon: Icon, label }) => (
          <div
            key={id}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 ${
              activeTab === id ? "text-velvet" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={24} />
            <span
              className={`text-xs mt-1 ${
                activeTab === id ? "font-semibold" : ""
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomBar;
