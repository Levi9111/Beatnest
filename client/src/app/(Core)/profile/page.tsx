"use client";

import { Upload, Heart, Users, Music, User, Headphones } from "lucide-react"; // Added ImageIcon for placeholders
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetUserByIdQuery } from "@/redux/api/userApi";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUploadSongMutation } from "@/redux/api/uploadSongApi";
import { toast } from "sonner";
import Image from "next/image";
import { Carousel } from "@/components/Carousel";
import ProfilePageModal from "@/components/ProfilePageModal";

interface SongUploadFormValues {
  title: string;
  audio: FileList;
  cover: FileList;
}

// --- Types ---
interface SongUploadFormValues {
  title: string;
  audio: FileList;
  cover: FileList;
}

interface Artist {
  id: number;
  name: string;
  imageUrl: string;
}

interface LikedSong {
  id: number;
  name: string;
  artist: string;
  imageUrl: string;
}

interface DemoUser {
  name: string;
  image: string;
  following: Artist[];
  likedSongs: LikedSong[];
}

// --- Carousel Component ---

// Dummy data for the user and carousel items
const demoUser: DemoUser = {
  name: "Shanjid Ahmad",
  image: "", // empty to simulate no profile image
  following: [
    {
      id: 1,
      name: "Artist One",
      imageUrl: "https://placehold.co/150x150/22C55E/FFFFFF?text=Artist+1",
    },
    {
      id: 2,
      name: "Artist Two",
      imageUrl: "https://placehold.co/150x150/1DA1F2/FFFFFF?text=Artist+2",
    },
    {
      id: 3,
      name: "Artist Three",
      imageUrl: "https://placehold.co/150x150/FF6347/FFFFFF?text=Artist+3",
    },
    {
      id: 4,
      name: "Artist Four",
      imageUrl: "https://placehold.co/150x150/8A2BE2/FFFFFF?text=Artist+4",
    },
    {
      id: 5,
      name: "Artist Five",
      imageUrl: "https://placehold.co/150x150/FFD700/000000?text=Artist+5",
    },
    {
      id: 6,
      name: "Artist Six",
      imageUrl: "https://placehold.co/150x150/ADFF2F/000000?text=Artist+6",
    },
  ],
  likedSongs: [
    {
      id: 101,
      name: "Song A",
      artist: "Artist X",
      imageUrl: "https://placehold.co/150x150/FF1493/FFFFFF?text=Song+A",
    },
    {
      id: 102,
      name: "Song B",
      artist: "Artist Y",
      imageUrl: "https://placehold.co/150x150/00CED1/FFFFFF?text=Song+B",
    },
    {
      id: 103,
      name: "Song C",
      artist: "Artist Z",
      imageUrl: "https://placehold.co/150x150/FFA500/FFFFFF?text=Song+C",
    },
    {
      id: 104,
      name: "Song D",
      artist: "Artist W",
      imageUrl: "https://placehold.co/150x150/6A5ACD/FFFFFF?text=Song+D",
    },
    {
      id: 105,
      name: "Song E",
      artist: "Artist V",
      imageUrl: "https://placehold.co/150x150/20B2AA/FFFFFF?text=Song+E",
    },
    {
      id: 106,
      name: "Song F",
      artist: "Artist U",
      imageUrl: "https://placehold.co/150x150/DDA0DD/000000?text=Song+F",
    },
  ],
};

const genreGradientPalette = [
  "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/30",
  "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-400/30",
  "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/30",
  "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-400/30",
  "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-400/30",
  "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-400/30",
  "bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-teal-300 border-teal-400/30",
  "bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-400/30",
];

const ProfilePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SongUploadFormValues>();
  const { data: myInfo } = useGetMeQuery(undefined);
  const { data: userData, isLoading: isUserDataLoading } = useGetUserByIdQuery(
    myInfo?.userId
  );
  const [uploadSong, { isLoading: isUploadSongLoading }] =
    useUploadSongMutation();
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(demoUser.image);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // TODO:
  // Change the loader ui and update it similar to ouah-success page
  if (isUserDataLoading) return <ProfilePageLoader />;

  const onSubmit = async (data: SongUploadFormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("audio", data.audio[0]);
    formData.append("image", data.cover[0]);

    try {
      const result = await uploadSong(formData).unwrap();
      reset();

      console.log(result);
      setPreviewCover(null);
      toast.success("Song uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      toast.warning("Failed to upload song!");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 sm:p-8 lg:p-12 font-inter animate-fadeIn">
      {" "}
      <ProfilePageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultValues={{
          userName: userData?.data?.userName,
          about: userData?.data?.about,
          likedGenres: userData?.data?.likedGenres,
        }}
      />
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Profile Information Section */}
        <section className="relative flex flex-col sm:flex-row items-center gap-8 bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-700">
          <div className="relative group">
            {profileImage ? (
              <Image
                width={800}
                height={600}
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-[#6f2da8] shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-[#8a4cd0]"
              />
            ) : (
              <label className="w-32 h-32 sm:w-40 sm:h-40 flex flex-col items-center justify-center rounded-full bg-gray-800 border-4 border-gray-700 cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:border-[#6f2da8] group-hover:scale-105">
                {" "}
                <Upload
                  size={32}
                  className="text-gray-400 group-hover:text-[#6f2da8] transition-colors duration-300"
                />{" "}
                <span className="text-sm text-gray-400 mt-1 group-hover:text-[#6f2da8] transition-colors duration-300">
                  Upload Photo
                </span>{" "}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-4xl font-extrabold text-[#6f2da8] mb-2">
              {" "}
              {userData?.data.userName || userData?.data.name}
            </h2>
            {/* About myself section */}
            <p className="text-lg text-gray-300">{userData.data.about}</p>
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
              {userData.data.likedGenres.map((item: string, i: number) => (
                <span
                  key={i}
                  className={`${
                    genreGradientPalette[i % genreGradientPalette.length]
                  } border px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm`}
                >
                  #{item}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-velvet hover:text-[#5c248a] underline cursor-pointer transition duration-200 italic absolute right-3 bottom-3"
          >
            edit profile
          </button>
        </section>

        {/* Following Section with Carousel */}
        <Carousel
          title="Following Artists"
          items={demoUser.following}
          icon={Users}
        />

        {/* Liked Songs Section with Carousel */}
        <Carousel
          title="Your Liked Songs"
          items={demoUser.likedSongs}
          icon={Heart}
        />

        {/* Upload Song Section */}
        <section className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-700  mx-auto">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-[#6f2da8] mb-8">
            <Music size={24} className="text-[#6f2da8]" />
            Upload Your Music
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Song Title */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="song-title"
                className="text-gray-300 text-sm font-medium"
              >
                Song Title
              </label>
              <input
                id="song-title"
                type="text"
                placeholder="Enter song title"
                {...register("title", { required: "Song title is required" })}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#6f2da8] focus:border-transparent transition-all duration-200"
              />
              {errors.title && (
                <span className="text-red-500 text-sm">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Audio File */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="audio-file"
                className="text-gray-300 text-sm font-medium"
              >
                Audio File (MP3, WAV, etc.)
              </label>
              <input
                id="audio-file"
                type="file"
                accept="audio/*"
                {...register("audio", { required: "Audio file is required" })}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#6f2da8] file:text-white hover:file:bg-[#5c248a] transition-colors duration-200 cursor-pointer"
              />
              {errors.audio && (
                <span className="text-red-500 text-sm">
                  {errors.audio.message}
                </span>
              )}
            </div>

            {/* Cover Image */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="cover-image"
                className="text-gray-300 text-sm font-medium"
              >
                Cover Image (JPG, PNG, etc.)
              </label>
              <input
                id="cover-image"
                type="file"
                accept="image/*"
                {...register("cover", { required: "Cover image is required" })}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#6f2da8] file:text-white hover:file:bg-[#5c248a] transition-colors duration-200 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreviewCover(URL.createObjectURL(file));
                  }
                }}
              />
              {errors.cover && (
                <span className="text-red-500 text-sm">
                  {errors.cover.message}
                </span>
              )}
            </div>

            {previewCover && (
              <div>
                <Image
                  width={800}
                  height={600}
                  src={previewCover}
                  alt="Cover Preview"
                  className="mt-2 w-32 rounded-md"
                />
              </div>
            )}

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isUploadSongLoading}
                className="w-full sm:w-auto bg-[#6f2da8] hover:bg-[#5c248a] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#6f2da8] focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
              >
                {isUploadSongLoading ? "Uploading..." : "Upload Song"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;

const ProfilePageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-neutral-950 text-white">
      <div className="w-full max-w-md px-8 py-12 rounded-2xl bg-dark-elevated/80 backdrop-blur-xl border border-gray-800 shadow-[0_0_30px_-10px_rgba(111,45,168,0.7)] flex flex-col items-center text-center space-y-6">
        {/* Header with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-[#6f2da8] to-purple-600 shadow-lg shadow-purple-500/25">
            <User size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Loading Your Profile
          </h1>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed">
          Fetching your musical identity and preferences from the beat universe.
        </p>

        {/* Enhanced Loader with Music Theme */}
        <div className="relative">
          {/* Main spinning ring */}
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-transparent bg-gradient-to-r from-[#6f2da8] via-purple-500 to-pink-500 p-1">
            <div className="rounded-full h-full w-full bg-gradient-to-br from-black via-zinc-900 to-neutral-950" />
          </div>

          {/* Floating music icons */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Music size={20} className="text-[#6f2da8] animate-pulse" />
              {/* Orbiting mini icons */}
              <div className="absolute -top-8 -left-2 animate-bounce delay-300">
                <Heart size={12} className="text-pink-400" />
              </div>
              <div className="absolute -bottom-8 -right-2 animate-bounce delay-700">
                <Headphones size={12} className="text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-[#6f2da8] rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-300" />
        </div>

        {/* Status text */}
        <p className="text-xs text-gray-500 pt-2">
          Syncing your beats and vibes...
        </p>

        {/* Subtle progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#6f2da8] to-purple-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
