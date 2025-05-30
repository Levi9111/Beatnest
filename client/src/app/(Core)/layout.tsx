"use client";
import BottomBar from "@/components/Bottombar";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Image from "next/image";

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentSong = useAppSelector(
    (state: RootState) => state.audioPlayer.currentSong
  );
  return (
    <div className="h-screen flex flex-col bg-black text-white relative">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto home-scroll px-6 py-4">
          {children}
        </main>
        <BottomBar />

        {/* Global Fixed Audio Player */}

        <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 flex items-center gap-4 text-white z-50 shadow-xl">
          <Image
            width={800}
            height={500}
            src={currentSong.coverImageUrl}
            alt={currentSong.title}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="flex flex-col flex-grow">
            <span className="text-sm font-semibold">{currentSong.title}</span>
            <span className="text-xs text-gray-400">
              {currentSong.uploadedBy.name}
            </span>
          </div>
          <audio
            src={currentSong.audioUrl}
            controls
            autoPlay
            className="w-full max-w-md"
          />
        </footer>
      </div>
    </div>
  );
}
