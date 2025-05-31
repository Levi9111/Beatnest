import { LucideIcon, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface CarouselItem {
  id: number | string;
  name: string;
  imageUrl: string;
  artist?: string;
}

interface CarouselProps {
  title: string;
  items: CarouselItem[];
  icon: LucideIcon;
}

export const Carousel = ({ title, items, icon: Icon }: CarouselProps) => {
  return (
    <section className="space-y-4">
      <h3 className="text-2xl font-bold flex items-center gap-3 text-[#6f2da8]">
        {" "}
        {/* Changed to velvet purple */}
        {Icon && <Icon size={24} className="text-[#6f2da8]" />} {title}{" "}
        {/* Changed to velvet purple */}
      </h3>
      <div className="flex overflow-x-auto pb-4 scrollbar-hide space-x-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-40 p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-800 group relative overflow-hidden"
          >
            {item.imageUrl ? (
              <Image
                width={800}
                height={400}
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-32 object-cover rounded-md mb-3 group-hover:opacity-80 transition-opacity duration-300"
              />
            ) : (
              <div className="w-full h-32 flex items-center justify-center bg-gray-700 rounded-md mb-3">
                <ImageIcon size={48} className="text-gray-400" />
              </div>
            )}
            <h4 className="text-lg font-semibold text-white truncate">
              {item.name}
            </h4>
            {item.artist && (
              <p className="text-sm text-gray-400 truncate">{item.artist}</p>
            )}
            {/* Optional: Add a play button overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <button className="p-3 bg-[#6f2da8] rounded-full hover:bg-[#5c248a] transition-colors duration-200">
                {" "}
                {/* Changed to velvet purple */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-play"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Custom scrollbar styling for better aesthetics */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </section>
  );
};
