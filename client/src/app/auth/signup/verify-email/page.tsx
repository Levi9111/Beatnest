"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useGetMeQuery, useVerifyOtpMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAccessToken } from "@/redux/slices/authSlice";

type VerifyFormData = {
  code: string;
};

const VerifyEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormData>();
  const router = useRouter();

  const { data: userData, isLoading, error } = useGetMeQuery(undefined);
  const [verifyOtp, { isLoading: isOtpLoading }] = useVerifyOtpMutation();
  const dispatch = useAppDispatch();

  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes countdown

  useEffect(() => {
    if (!isLoading && !isOtpLoading && userData?.isAuthenticated) {
      router.push("/home");
    }
  }, [isLoading, isOtpLoading, userData, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const onSubmit = async (data: VerifyFormData) => {
    const result = await verifyOtp({
      email: userData.email,
      otp: data.code,
    });
    console.log(result);
    console.log(result.data.accessToken);
    dispatch(setAccessToken(result.data.accessToken));
    router.push("/auth/signup/user-name");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-black">
        <p>Something went wrong while checking authentication.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-neutral-950 text-white">
        <div className="w-full max-w-md p-10 space-y-6 rounded-2xl overflow-hidden border border-gray-800 bg-dark-elevated/80 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_0_40px_-10px_rgba(111,45,168,0.6)]">
          <div className="text-center space-y-2">
            <ShieldCheck size={28} className="mx-auto text-velvet" />
            <h2 className="text-2xl font-bold">Verify Your Email</h2>
            <p className="text-sm text-gray-400">
              We’ve sent a 6-digit verification code to your email. Please enter
              it below.
            </p>
            <p className="text-sm text-gray-400">
              Your OTP expires in:{" "}
              <span className="text-white font-semibold">
                {formatTime(secondsLeft)}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Verification Code</label>
              <Input
                type="text"
                placeholder="123456"
                maxLength={6}
                {...register("code", {
                  required: "Verification code is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Must be a 6-digit code",
                  },
                })}
                className="w-full py-2 pl-4 bg-dark-background border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[--color-velvet]"
              />
              {errors.code && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-velvet hover:bg-velvet/90 transition rounded-lg text-white font-medium py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>

          <p className="text-xs text-gray-400 text-center pt-2">
            Didn’t receive a code?{" "}
            <button
              className="underline text-white hover:text-velvet transition"
              type="button"
              // TODO: Trigger resend
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VerifyEmail;
