import { Search, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import NavbarPopUp from "./NavbarPopUp";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-dark-background text-white shadow-md border-b border-gray-700 relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-velvet">
          <Play size={20} className="text-white" />
        </div>
        <span className="text-xl font-semibold">Beatnest</span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search music, artists, albums..."
            className="w-full pl-10 pr-4 py-2 bg-dark-elevated text-white border border-gray-600 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[--color-velvet]"
          />
        </div>
      </div>

      {/* User Icon */}
      <NavbarPopUp />
    </div>
  );
};

export default Navbar;
