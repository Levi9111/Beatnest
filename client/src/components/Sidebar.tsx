"use client";

import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Clock,
  Music,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Sidebar = () => {
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [playlistsOpen, setPlaylistsOpen] = useState(true);

  return (
    <div className="h-[calc(100vh-64px)] bg-dark-elevated text-white border-r border-gray-700 flex flex-col justify-between p-4">
      {/* Top Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <SidebarItem icon={<Home size={20} />} label="Home" active />
          <SidebarItem icon={<Search size={20} />} label="Search" />
        </div>

        {/* Library */}
        <div className="pt-4 border-t border-gray-700">
          <div
            className="flex items-center justify-between cursor-pointer px-2 py-2 hover:bg-gray-800 rounded-lg"
            onClick={() => setLibraryOpen(!libraryOpen)}
          >
            <div className="flex items-center gap-3 text-gray-300 hover:text-white">
              <Library size={20} />
              <span>Your Library</span>
            </div>
            {libraryOpen ? (
              <ChevronDown size={18} className="text-gray-400" />
            ) : (
              <ChevronRight size={18} className="text-gray-400" />
            )}
          </div>

          <AnimatePresence initial={false}>
            {libraryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-2 px-2 space-y-2"
              >
                <SidebarItem
                  icon={<Plus size={18} />}
                  label="Create Playlist"
                  small
                />
                <SidebarItem
                  icon={<Heart size={18} className="text-pink-400" />}
                  label="Liked Songs"
                  small
                />
                <SidebarItem
                  icon={<Clock size={18} className="text-green-400" />}
                  label="Recently Played"
                  small
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Playlists */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-sm text-gray-400">
        <div
          className="flex items-center justify-between cursor-pointer px-2 py-2 hover:bg-gray-800 rounded-lg"
          onClick={() => setPlaylistsOpen(!playlistsOpen)}
        >
          <div className="flex items-center gap-2 text-gray-300 hover:text-white">
            <Music size={18} />
            <span>Playlists</span>
          </div>
          {playlistsOpen ? (
            <ChevronDown size={18} className="text-gray-400" />
          ) : (
            <ChevronRight size={18} className="text-gray-400" />
          )}
        </div>

        <AnimatePresence initial={false}>
          {playlistsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-2 max-h-[30vh] custom-scroll px-2 space-y-1"
            >
              {[
                "Jazz Vibes",
                "Daily Mix 1",
                "Coding Chill",
                "Rap Caviar",
                "Lo-fi Beats",
                "Top Hits Global",
                "Focus Flow",
                "Synthwave 84",
                "Beast Mode",
              ].map((playlist, i) => (
                <div
                  key={i}
                  className="hover:text-white hover:bg-gray-800 px-2 py-1 rounded cursor-pointer flex items-center justify-between"
                >
                  <span>{playlist}</span>
                  <ChevronRight size={16} className="text-gray-500" />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SidebarItem = ({
  icon,
  label,
  active = false,
  small = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  small?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition text-sm ${
      active
        ? "bg-[--color-velvet] text-white font-semibold"
        : "text-gray-300 hover:bg-gray-800"
    } ${small ? "text-xs px-2 py-1" : ""}`}
  >
    {icon}
    <span>{label}</span>
  </div>
);

export default Sidebar;
