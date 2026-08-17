export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f] font-sans antialiased selection:bg-indigo-200">
      {children}
    </div>
  );
}
