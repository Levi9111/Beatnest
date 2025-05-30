import BottomBar from "@/components/Bottombar";
import GlobalAudioPlayer from "@/components/GlobalAudioPlayer";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen pb-24 flex flex-col bg-black text-white relative">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto home-scroll px-6 py-4">
          {children}
        </main>
        <BottomBar />

        <GlobalAudioPlayer />
      </div>
    </div>
  );
}
