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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NavbarPopUp = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer flex items-center gap-1"
      >
        <User size={28} className="text-gray-300" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-6 w-64 bg-dark-elevated border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="font-medium text-white">John Doe</p>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Mail size={14} /> john@example.com
              </p>
            </div>
            <ul className="text-sm text-gray-300">
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer">
                <History size={16} /> Listening History
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
              <button className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-800 text-sm">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarPopUp;
