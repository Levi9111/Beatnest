"use client";

import { Mail, Lock, Play, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SocialAuth from "@/components/SocialAuth";
import { useAppDispatch } from "@/redux/hooks";
import { setAccessToken } from "@/redux/slices/authSlice";

interface LoginFormValues {
  email: string;
  password: string;
  agree: boolean;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setAccessToken(result.accessToken));
      toast.success("Login successful! Redirecting...");
      router.push("/");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err?.data?.errorSources?.[0]?.message ||
        err?.data?.message ||
        "Login failed";

      toast.error(message);
    }
  };

  console.log(error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-neutral-950 text-white">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-2xl  overflow-hidden border border-gray-800 bg-dark-elevated/80 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(111,45,168,0.6)]">
        {/* Social Logins - now on left */}
        <div className="p-10 bg-zinc-950 border-r border-gray-800 flex flex-col justify-center space-y-5">
          {/* Heading with logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-velvet shadow-md">
              <Play size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold">Welcome back to Beatnest </h2>
          </div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Sign in quickly using
          </h3>

          <SocialAuth />
        </div>

        {/* Login Form - on right */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-10 space-y-6 bg-velvet/10 backdrop-blur-sm"
        >
          <p className="text-gray-400 text-xl font-semibold flex items-center gap-2">
            <LogIn size={20} className="text-velvet font-bold" />
            Log in with your email and password
          </p>

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <div className="relative flex items-center justify-start">
                <Mail className="absolute left-3 text-gray-400" size={18} />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 py-2 bg-dark-background border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-velvet"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative flex items-center justify-start">
                <Lock className="absolute left-3 text-gray-400" size={18} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 py-2 bg-dark-background border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[--color-velvet]"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                  })}
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
              disabled={isLoading}
              className="w-full bg-velvet hover:bg-velvet/90 cursor-pointer transition rounded-lg text-white font-medium py-2"
            >
              Log In
            </Button>
          </div>

          {/* Terms with checkbox */}
          <label className="flex items-start text-xs text-gray-400 gap-2 pt-4">
            <input
              type="checkbox"
              defaultChecked={true}
              className="mt-1 accent-velvet w-4 h-4 rounded bg-dark-background border border-gray-600"
              {...register("agree", {
                required: "You must agree to the terms and conditions",
              })}
            />
            <span>
              By continuing, you agree to Beatnest’s{" "}
              <Link
                href="/terms-and-conditions"
                className="underline text-white"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline text-white">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.agree && (
            <p className="text-sm text-red-500 mt-1">{errors.agree.message}</p>
          )}

          <p className="text-sm text-gray-400 text-center pt-4">
            Don’t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-white underline hover:text-velvet transition"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
