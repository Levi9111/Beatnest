"use client";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setVolume, togglePlayPause } from "@/redux/slices/audioPlayerSlice";
import Image from "next/image";

const GlobalAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong, isPlaying, volume } = useSelector(
    (state: RootState) => state.audioPlayer
  );

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        dispatch(togglePlayPause());
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [dispatch]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setVolume(Number(e.target.value)));
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-4 py-3 border-t border-gray-700 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <Image
          width={600}
          height={400}
          src={currentSong.coverImageUrl}
          alt={currentSong.title}
          className="w-12 h-12 rounded object-cover"
        />
        <div>
          <p className="font-semibold">{currentSong.title}</p>
          <p className="text-sm text-gray-400">{currentSong.uploadedBy.name}</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-4">
          <button>
            <SkipBack size={20} />
          </button>
          <button onClick={() => dispatch(togglePlayPause())}>
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button>
            <SkipForward size={20} />
          </button>
        </div>
        <input
          type="range"
          min={0}
          max={audioRef.current?.duration ?? 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-64 mt-2 accent-[#6f2da8]"
        />
      </div>

      <div className="flex items-center gap-2 w-36">
        {volume > 0 ? <Volume2 /> : <VolumeX />}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolume}
          className="accent-[#6f2da8]"
        />
      </div>

      <audio ref={audioRef} src={currentSong.audioUrl} autoPlay />
    </div>
  );
};

export default GlobalAudioPlayer;
