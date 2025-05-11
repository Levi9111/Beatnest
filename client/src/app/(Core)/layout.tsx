import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-dark-background text-dark-text">
      <Navbar />
      <div className="grid grid-cols-[300px_1fr]">
        <Sidebar />
        <section className="p-6 overflow-y-auto">{children}</section>
      </div>
    </div>
  );
}
