"use client";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Heart,
  MoreHorizontal,
  Maximize2,
} from "lucide-react";
import { RootState } from "@/redux/store";
import { setVolume, togglePlayPause } from "@/redux/slices/audioPlayerSlice";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const GlobalAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying, volume } = useAppSelector(
    (state: RootState) => state.audioPlayer
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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
    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === "all") {
        // TODO: Handle next song logic here
      }
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isDragging, repeatMode]);
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        dispatch(togglePlayPause());
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [dispatch]);
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  const handleSeekStart = () => {
    setIsDragging(true);
  };
  const handleSeekEnd = () => {
    setIsDragging(false);
  };
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setVolume(Number(e.target.value)));
  };
  const toggleMute = () => {
    dispatch(setVolume(volume > 0 ? 0 : 0.7));
  };
  const toggleRepeat = () => {
    const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercentage = volume * 100;

  if (!currentSong) return null;

  return (
    <>
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 via-gray-900 to-gray-900/95 backdrop-blur-md text-white border-t border-gray-700/50 z-50">
        {/* Progress bar at the very top */}
        <div className="relative h-1 bg-gray-700/50 group cursor-pointer">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            onMouseDown={handleSeekStart}
            onMouseUp={handleSeekEnd}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              left: `${progressPercentage}%`,
              transform: "translateX(-50%) translateY(-50%)",
            }}
          />
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left section - Song info */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="relative group">
                <Image
                  width={56}
                  height={56}
                  src={currentSong.coverImageUrl}
                  alt={currentSong.title}
                  className="w-14 h-14 rounded-lg object-cover shadow-lg"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <Maximize2 size={16} className="text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white truncate hover:text-purple-400 transition-colors cursor-pointer">
                  {currentSong.title}
                </h3>
                <p className="text-sm text-gray-400 truncate hover:text-gray-300 transition-colors cursor-pointer">
                  {currentSong.uploadedBy.name}
                </p>
              </div>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isLiked
                    ? "text-red-500 hover:text-red-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Center section - Controls */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    isShuffled
                      ? "text-purple-400 hover:text-purple-300"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Shuffle size={16} />
                </button>

                <button className="p-2 rounded-full transition-all duration-200 hover:scale-110 text-gray-400 hover:text-white">
                  <SkipBack size={20} />
                </button>

                <button
                  onClick={() => dispatch(togglePlayPause())}
                  className="bg-velvet text-gray-300 p-3 rounded-full hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isPlaying ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} className="ml-0.5" />
                  )}
                </button>

                <button className="p-2 rounded-full transition-all duration-200 hover:scale-110 text-gray-400 hover:text-white">
                  <SkipForward size={20} />
                </button>

                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 relative ${
                    repeatMode !== "off"
                      ? "text-purple-400 hover:text-purple-300"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Repeat size={16} />
                  {repeatMode === "one" && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      1
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 w-full">
                <span className="w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 h-1 bg-gray-700 rounded-full relative group cursor-pointer">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-150"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="w-10">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right section - Volume and menu */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <div
                className="relative flex items-center gap-2"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full transition-all duration-200 hover:scale-110 text-gray-400 hover:text-white"
                >
                  {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>

                <div
                  className={`flex items-center transition-all duration-300 ${
                    showVolumeSlider ? "w-24 opacity-100" : "w-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="relative w-full h-1 bg-gray-700 rounded-full group cursor-pointer">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${volumePercentage}%` }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={handleVolume}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        left: `${volumePercentage}%`,
                        transform: "translateX(-50%) translateY(-50%)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <button className="p-2 rounded-full transition-all duration-200 hover:scale-110 text-gray-400 hover:text-white">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>

        <audio ref={audioRef} src={currentSong.audioUrl} />
      </div>

      {/* Mobile Audio Player */}
      <div className="w-[97%] rounded-t-xl mx-auto md:hidden fixed bottom-16 left-0 right-0 bg-gray-900 text-white z-50 border-t border-gray-800">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Song Info */}
          <div className="flex items-center gap-3 overflow-hidden">
            <Image
              src={currentSong.coverImageUrl}
              alt={currentSong.title}
              width={48}
              height={48}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-medium truncate">
                {currentSong.title}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {currentSong.uploadedBy.name}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(togglePlayPause())}
              className="text-white p-2 rounded-full bg-purple-600 hover:bg-purple-500 transition"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-700 relative">
          <div
            className="absolute  left-0 h-full bg-purple-500 transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </>
  );
};

export default GlobalAudioPlayer;
