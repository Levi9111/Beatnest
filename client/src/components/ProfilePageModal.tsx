"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUserInfoMutation } from "@/redux/api/userApi";

type UserFormData = {
  userName: string;
  about?: string;
};

type ProfilePageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultValues: UserFormData & { likedGenres: string[] };
};

// Enhanced genre options with beautiful gradient combinations
const genreOptions = [
  {
    name: "Pop",
    gradient: "from-pink-500 to-rose-400",
    ring: "ring-pink-400/30",
    shadow: "shadow-pink-500/25",
  },
  {
    name: "Rock",
    gradient: "from-red-600 to-orange-500",
    ring: "ring-red-400/30",
    shadow: "shadow-red-500/25",
  },
  {
    name: "Hip-Hop",
    gradient: "from-yellow-400 to-amber-500",
    ring: "ring-yellow-400/30",
    shadow: "shadow-yellow-500/25",
  },
  {
    name: "Electronic",
    gradient: "from-cyan-500 to-blue-500",
    ring: "ring-cyan-400/30",
    shadow: "shadow-cyan-500/25",
  },
  {
    name: "Jazz",
    gradient: "from-purple-600 to-indigo-600",
    ring: "ring-purple-400/30",
    shadow: "shadow-purple-500/25",
  },
  {
    name: "Classical",
    gradient: "from-emerald-500 to-teal-500",
    ring: "ring-emerald-400/30",
    shadow: "shadow-emerald-500/25",
  },
  {
    name: "R&B",
    gradient: "from-rose-500 to-pink-600",
    ring: "ring-rose-400/30",
    shadow: "shadow-rose-500/25",
  },
  {
    name: "Country",
    gradient: "from-amber-600 to-yellow-600",
    ring: "ring-amber-400/30",
    shadow: "shadow-amber-500/25",
  },
  {
    name: "Reggae",
    gradient: "from-green-500 to-emerald-600",
    ring: "ring-green-400/30",
    shadow: "shadow-green-500/25",
  },
  {
    name: "Blues",
    gradient: "from-blue-700 to-indigo-700",
    ring: "ring-blue-400/30",
    shadow: "shadow-blue-500/25",
  },
  {
    name: "Folk",
    gradient: "from-stone-500 to-amber-700",
    ring: "ring-stone-400/30",
    shadow: "shadow-stone-500/25",
  },
  {
    name: "Alternative",
    gradient: "from-violet-600 to-purple-700",
    ring: "ring-violet-400/30",
    shadow: "shadow-violet-500/25",
  },
  {
    name: "Indie",
    gradient: "from-teal-500 to-cyan-600",
    ring: "ring-teal-400/30",
    shadow: "shadow-teal-500/25",
  },
  {
    name: "Funk",
    gradient: "from-fuchsia-500 to-purple-600",
    ring: "ring-fuchsia-400/30",
    shadow: "shadow-fuchsia-500/25",
  },
  {
    name: "Metal",
    gradient: "from-gray-700 to-slate-800",
    ring: "ring-gray-400/30",
    shadow: "shadow-gray-500/25",
  },
  {
    name: "Disco",
    gradient: "from-pink-400 to-violet-500",
    ring: "ring-pink-400/30",
    shadow: "shadow-pink-500/25",
  },
];

const ProfilePageModal = ({
  isOpen,
  onClose,
  defaultValues,
}: ProfilePageModalProps) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    defaultValues?.likedGenres || []
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues,
  });

  const [updateUser, { isLoading }] = useUpdateUserInfoMutation();

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const onSubmit = async (data: UserFormData) => {
    const result = await updateUser({
      ...data,
      likedGenres: selectedGenres,
    }).unwrap();
    console.log(result);
    try {
      toast.success("Profile updated!");
      onClose();
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 text-white max-w-2xl w-full shadow-2xl backdrop-blur-sm h-[90vh] overflow-y-scroll custom-scroll ">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-[#6f2da8] to-purple-400 bg-clip-text text-transparent">
            Edit Your Profile
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-2">
            Customize your music identity and preferences
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Username
            </label>
            <input
              {...register("userName", { required: "Username is required" })}
              className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/25 transition-all duration-200 backdrop-blur-sm"
              placeholder="Enter your username"
            />
            {errors.userName && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* About Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              About Yourself
            </label>
            <textarea
              {...register("about")}
              rows={4}
              className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/25 transition-all duration-200 backdrop-blur-sm resize-none"
              placeholder="Tell us about your musical journey..."
            />
          </div>

          {/* Genre Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium text-gray-200">
                What&apos;s your vibe? 🎵
              </p>
              <span className="text-sm text-gray-400">
                {selectedGenres.length} selected
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {genreOptions.map(({ name, gradient, ring, shadow }) => {
                const isSelected = selectedGenres.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleGenre(name)}
                    className={`
                      relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${
                        isSelected
                          ? `bg-gradient-to-r ${gradient} text-white ring-2 ${ring} ${shadow} shadow-lg`
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30 hover:border-gray-500/50"
                      }
                    `}
                  >
                    <span className="relative z-10">{name}</span>
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#6f2da8] to-purple-600 hover:from-[#5c248a] hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating Profile...
                </div>
              ) : (
                "Update Profile ✨"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePageModal;
