import { AuthContextProvider } from "../lib/contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";

export default function Layout({ children }) {
  return (
    <AuthContextProvider>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-55 shrink-0 border-r bg-white dark:bg-gray-800">
          <Sidebar />
        </aside>

        {/* Right Side (Header + Content) */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden sticky top-0 z-20 flex items-center gap-3 px-4 h-14 border-b bg-white dark:bg-gray-800 overflow-hidden">
            <MobileSidebar />
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
              Admin Panel
            </h1>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-hidden p-1 md:p-3">{children}</main>
        </div>
      </div>
    </AuthContextProvider>
  );
}
