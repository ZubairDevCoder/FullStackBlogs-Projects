"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LayoutList, Layers, User, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Posts",
      href: "/admin/posts",
      icon: LayoutList,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Layers,
    },
    {
      name: "Authors",
      href: "/admin/authors",
      icon: User,
    },
    {
      name: "Admins",
      href: "/admin/useradmins",
      icon: Crown,
    },
  ];
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside className="w-64 min-h-screen border-r bg-white dark:bg-gray-900 relative dark:border-gray-800">
      {/* Header */}
      <div className="px-6 py-5 border-b dark:border-gray-800">
        <h2 className="text-lg font-semibold tracking-tight">Admin Panel</h2>
        <p className="text-xs text-muted-foreground">Manage your content</p>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-purple-600 text-white shadow"
                    : "text-purple-700 dark:text-gray-300 hover:bg-purple-500 hover:text-white dark:hover:bg-gray-800"
                }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      {/* Logout Button */}
      <div className="absolute bottom-4  left-0 w-full px-3 ">
        <Button
          variant="default"
          className="w-50 mx-auto  flex items-center gap-2 justify-center"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
