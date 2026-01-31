import { AuthContextProvider } from "../lib/contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";

export default function Layout({ children }) {
  return (
    <AuthContextProvider>
      <section className="min-h-screen flex dark:bg-gray-800 overflow-hidden ">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block">
          <Sidebar />
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Topbar */}
          <header className="md:hidden flex items-center gap-3 px-4 h-14 border-b bg-white dark:bg-gray-900">
            <MobileSidebar />
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </header>

          {/* Page Content */}
          <main className="flex-1 px-2 py-2 w-full overflow-hidden ">
            {children}
          </main>
        </div>
      </section>
    </AuthContextProvider>
  );
}
