import Navbar from "~/components/Navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="p-16 h-full">
        {children}
      </div>
    </div>
  );
}