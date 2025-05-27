"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, KeyRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import { useEffect, useState } from "react";

type ResetFormValues = {
  otp: string;
  password: string;
};

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [resetPassword] = useResetPasswordMutation();

  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes

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

  const onSubmit = async (data: ResetFormValues) => {
    if (!email) {
      toast.error("Missing email");
      return;
    }

    console.log(email, data);

    try {
      await resetPassword({
        email,
        otp: data.otp,
        newPassword: data.password,
      }).unwrap();

      toast.success("Password reset successful! Please log in.");
      router.push("/auth/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg =
        err?.data?.errorSources?.[0]?.message ||
        err?.data?.message ||
        "Failed to reset password";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-neutral-950 text-white">
      <div className="w-full max-w-md p-10 space-y-6 rounded-2xl border border-gray-800 bg-dark-elevated/80 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_0_40px_-10px_rgba(111,45,168,0.6)]">
        <div className="text-center space-y-2">
          <KeyRound size={28} className="mx-auto text-velvet" />
          <h2 className="text-2xl font-bold">Reset Your Password</h2>
          <p className="text-sm text-gray-400">
            Enter the 6-digit OTP sent to your email and your new password.
          </p>
          <p className="text-sm text-gray-400">
            OTP expires in:{" "}
            <span className="text-white font-semibold">
              {formatTime(secondsLeft)}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* OTP */}
          <div>
            <label className="block text-sm mb-1">Verification Code</label>
            <Input
              type="text"
              placeholder="123456"
              maxLength={6}
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Must be a 6-digit code",
                },
              })}
              className="w-full py-2 pl-4 bg-dark-background border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-velvet"
            />
            {errors.otp && (
              <p className="text-sm text-red-500 mt-1">{errors.otp.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-gray-400" size={18} />
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                className="w-full pl-10 py-2 bg-dark-background border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-velvet"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || secondsLeft === 0}
            className="w-full bg-velvet hover:bg-velvet/90 transition rounded-lg text-white font-medium py-2"
          >
            {isSubmitting ? "Submitting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
