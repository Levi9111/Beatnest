"use client";

import { useGetAllSongsQuery } from "@/redux/api/uploadSongApi";
import { Loader2, Music } from "lucide-react";
import Image from "next/image";
import { Song } from "@/types/song";
import { useAppDispatch } from "@/redux/hooks";
import { setCurrentSong } from "@/redux/slices/audioPlayerSlice";

const HomeContents = () => {
  const { data: songs, isLoading, isError } = useGetAllSongsQuery(undefined);
  const dispatch = useAppDispatch();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white animate-pulse">
        <Loader2 className="animate-spin text-[--color-velvet]" size={40} />
        <p className="mt-4 text-gray-400">Loading your music...</p>
      </div>
    );
  }

  if (isError || !songs) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white text-center">
        <p className="text-red-500">
          Failed to load songs. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-28">
      {" "}
      {/* Add bottom padding to avoid player overlap */}
      <section className="px-6 py-10 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-3 text-[--color-velvet] mb-8">
          <Music size={24} /> Your Music Feed
        </h1>

        {songs.length === 0 ? (
          <p className="text-gray-400">
            No songs found. Start uploading to see them here.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song: Song) => (
              <div
                key={song._id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-[--color-velvet] transition cursor-pointer"
                onClick={() => dispatch(setCurrentSong(song))}
              >
                <Image
                  width={800}
                  height={500}
                  src={song.coverImageUrl}
                  alt={song.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h2 className="text-lg font-semibold">{song.title}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  By {song.uploadedBy.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeContents;
