"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

type VerifyFormData = {
  code: string;
};

const VerifyEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormData>();

  const onSubmit = (data: VerifyFormData) => {
    console.log("Verification code submitted:", data.code);
    // TODO: Call backend endpoint to verify the code
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-neutral-950 text-white">
      <div className="w-full max-w-md p-10 space-y-6 rounded-2xl overflow-hidden border border-gray-800 bg-dark-elevated/80 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_0_40px_-10px_rgba(111,45,168,0.6)]">
        <div className="text-center space-y-2">
          <ShieldCheck size={28} className="mx-auto text-velvet" />
          <h2 className="text-2xl font-bold">Verify Your Email</h2>
          <p className="text-sm text-gray-400">
            We’ve sent a 6-digit verification code to your email. Please enter
            it below.
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
              <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>
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
  );
};

export default VerifyEmail;
