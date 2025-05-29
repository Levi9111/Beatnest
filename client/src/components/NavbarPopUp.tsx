"use client";
import { useState } from "react";
import {
  User,
  History,
  Settings,
  Crown,
  FileText,
  LogOut,
  Mail,
  LogIn,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { clearAccessToken } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { generateColorFromString, getInitials } from "@/utils";
import Link from "next/link";

const NavbarPopUp = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data: myInfo } = useGetMeQuery(undefined);

  const handleLogout = () => {
    dispatch(clearAccessToken());
    router.push("/auth/login");
  };

  return (
    <div className="relative">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer flex items-center gap-1"
      >
        {myInfo?.name ? (
          <div
            className="w-9 h-9 flex items-center justify-center rounded-full text-white font-semibold text-sm"
            style={{
              backgroundColor: generateColorFromString(myInfo.name),
            }}
          >
            {getInitials(myInfo.name)}
          </div>
        ) : (
          <User size={28} className="text-gray-300" />
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-6 w-64 bg-dark-elevated border border-gray-700 bg-[#121212] rounded-lg shadow-lg overflow-hidden z-50"
          >
            {myInfo?.email ? (
              <>
                {/* Logged In View */}
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="font-medium text-white">{myInfo.name}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Mail size={14} /> {myInfo.email}
                  </p>
                </div>
                <ul className="text-sm text-gray-300">
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer"
                    >
                      <UserCircle size={16} /> Profile
                    </Link>
                  </li>
                  <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer">
                    <History size={16} /> History
                  </li>
                  <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer">
                    <Settings size={16} /> Settings
                  </li>
                  <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer">
                    <Crown size={16} /> Premium
                  </li>
                  <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer">
                    <FileText size={16} /> Terms & Conditions
                  </li>
                </ul>
                <div className="border-t border-gray-700">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-800 text-sm"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Logged Out View */}
                <div className="px-4 py-5 text-center text-white">
                  <p className="text-base font-medium mb-1">
                    Welcome to Beatnest
                  </p>
                  <p className="text-sm text-gray-400">
                    Log in to access your account
                  </p>
                </div>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-velvet text-white rounded-lg hover:bg-velvet/90 transition"
                  >
                    <LogIn size={16} /> Login / Signup
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarPopUp;
