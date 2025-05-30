"use client";

import { Upload, Heart, Users, Music, Image as ImageIcon } from "lucide-react"; // Added ImageIcon for placeholders
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetUserByIdQuery } from "@/redux/api/userApi";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUploadSongMutation } from "@/redux/api/uploadSongApi";
import { toast } from "sonner";

interface SongUploadFormValues {
  title: string;
  audio: FileList;
  cover: FileList;
}

// Dummy data for the user and carousel items
const demoUser = {
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

// Reusable Carousel Component
const Carousel = ({ title, items, icon: Icon }) => {
  return (
    <section className="space-y-4">
      <h3 className="text-2xl font-bold flex items-center gap-3 text-[#6f2da8]">
        {" "}
        {/* Changed to velvet purple */}
        {Icon && <Icon size={24} className="text-[#6f2da8]" />} {title}{" "}
        {/* Changed to velvet purple */}
      </h3>
      <div className="flex overflow-x-auto pb-4 scrollbar-hide space-x-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-40 p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-800 group relative overflow-hidden"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-32 object-cover rounded-md mb-3 group-hover:opacity-80 transition-opacity duration-300"
              />
            ) : (
              <div className="w-full h-32 flex items-center justify-center bg-gray-700 rounded-md mb-3">
                <ImageIcon size={48} className="text-gray-400" />
              </div>
            )}
            <h4 className="text-lg font-semibold text-white truncate">
              {item.name}
            </h4>
            {item.artist && (
              <p className="text-sm text-gray-400 truncate">{item.artist}</p>
            )}
            {/* Optional: Add a play button overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <button className="p-3 bg-[#6f2da8] rounded-full hover:bg-[#5c248a] transition-colors duration-200">
                {" "}
                {/* Changed to velvet purple */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-play"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Custom scrollbar styling for better aesthetics */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </section>
  );
};

const ProfilePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SongUploadFormValues>();
  const { data: myInfo } = useGetMeQuery(undefined);
  const [uploadSong, { isLoading: isUploadSongLoading }] =
    useUploadSongMutation();
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState(demoUser.image);

  const { userId } = myInfo || {};
  const { data: userData, isLoading: isUserDataLoading } =
    useGetUserByIdQuery(userId);

  const handleImageUpload = (e) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // TODO:
  // Change the loader ui and update it similar to ouah-success page
  if (isUserDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white p-6 sm:p-8 lg:p-12 font-inter">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-10 w-10 text-[#6f2da8]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <p className="text-gray-400 text-sm">Loading profile data...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: SongUploadFormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("audio", data.audio[0]);
    formData.append("image", data.cover[0]);

    console.log(userData);

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
      {/* Base background and text color updated */}
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Profile Section */}
        <section className="flex flex-col sm:flex-row items-center gap-8 bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-700">
          <div className="relative group">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-[#6f2da8] shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-[#8a4cd0]"
              />
            ) : (
              <label className="w-32 h-32 sm:w-40 sm:h-40 flex flex-col items-center justify-center rounded-full bg-gray-800 border-4 border-gray-700 cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:border-[#6f2da8] group-hover:scale-105">
                {" "}
                {/* Changed to velvet purple */}
                <Upload
                  size={32}
                  className="text-gray-400 group-hover:text-[#6f2da8] transition-colors duration-300"
                />{" "}
                {/* Changed to velvet purple */}
                <span className="text-sm text-gray-400 mt-1 group-hover:text-[#6f2da8] transition-colors duration-300">
                  Upload Photo
                </span>{" "}
                {/* Changed to velvet purple */}
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
              {/* Changed to velvet purple */}
              {demoUser.name}
            </h2>
            <p className="text-lg text-gray-300">Music Lover & Creator</p>
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
              <span className="bg-[#6f2da8]/20 text-[#8a4cd0] px-4 py-1 rounded-full text-sm font-medium">
                {" "}
                {/* Changed to velvet purple shades */}
                #Pop
              </span>
              <span className="bg-purple-600/20 text-purple-300 px-4 py-1 rounded-full text-sm font-medium">
                #Electronic
              </span>
              <span className="bg-blue-600/20 text-blue-300 px-4 py-1 rounded-full text-sm font-medium">
                #Indie
              </span>
            </div>
          </div>
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
                <img
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
