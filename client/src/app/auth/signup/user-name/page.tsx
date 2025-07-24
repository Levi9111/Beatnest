"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUpdateUserInfoMutation } from "@/redux/api/userApi";

interface UsernameFormData {
  username: string;
}

const CreateUsername = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UsernameFormData>();
  const router = useRouter();
  const { data: userData, isLoading, error } = useGetMeQuery(undefined);
  const [updateUserInfo, { isLoading: isUpdating }] =
    useUpdateUserInfoMutation();

  useEffect(() => {
    if (!isLoading && userData?.userName) {
      router.push("/");
    }
  }, [isLoading, , userData, router]);

  const onSubmit = async (formData: UsernameFormData) => {
    const updatedData = {
      id: userData.userId,
      userName: formData.username,
    };

    const result = await updateUserInfo(updatedData);

    console.log(result);

    if (result?.data?.success) {
      router.push("/");
    }
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
            <UserPlus size={28} className="mx-auto text-velvet" />
            <h2 className="text-2xl font-bold">Choose a Username</h2>
            <p className="text-sm text-gray-400">
              This will be your unique username on Beatnest.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Username</label>
              <Input
                type="text"
                placeholder="your_username"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Must be at least 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Cannot exceed 20 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Only letters, numbers and underscores allowed",
                  },
                })}
                className="w-full py-2 pl-4 bg-dark-background border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[--color-velvet]"
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-velvet hover:bg-velvet/90 transition rounded-lg text-white font-medium py-2"
              disabled={isSubmitting || isUpdating}
            >
              {isSubmitting || isUpdating ? "Saving..." : "Save Username"}
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CreateUsername;
