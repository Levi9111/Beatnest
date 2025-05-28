"use client";
import { useAppDispatch } from "@/redux/hooks";
import { setAccessToken } from "@/redux/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";

const OAuthSuccess = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");

  useEffect(() => {
    if (accessToken) {
      dispatch(setAccessToken(accessToken));
      setTimeout(() => {
        router.push("/");
      }, 1000); // Optional delay for user to see loader
    }
  }, [accessToken, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-neutral-950 text-white">
      <div className="w-full max-w-md px-8 py-12 rounded-2xl bg-dark-elevated/80 backdrop-blur-xl border border-gray-800 shadow-[0_0_30px_-10px_rgba(111,45,168,0.7)] flex flex-col items-center text-center space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-velvet shadow-md">
            <Sparkles size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold">Logging You In</h1>
        </div>

        <p className="text-gray-400 text-sm">
          Hang tight while we set things up for your Beatnest experience.
        </p>

        {/* Cool Loader */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-velvet" />

        <p className="text-xs text-gray-500 pt-4">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
