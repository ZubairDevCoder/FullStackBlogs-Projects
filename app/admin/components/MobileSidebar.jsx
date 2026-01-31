"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LayoutList,
  Layers,
  User,
  Crown,
  Menu,
} from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function MobileSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: LayoutList },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Authors", href: "/admin/authors", icon: User },
    { name: "Admins", href: "/admin/useradmins", icon: Crown },
  ];

  return (
    <Sheet>
      {/* Hamburger Button */}
      <SheetTrigger asChild>
        <button className="md:hidden p-2 rounded-lg border hover:bg-muted">
          <Menu size={22} />
        </button>
      </SheetTrigger>

      {/* Sliding Sidebar */}
      <SheetContent side="left" className="w-64 p-0">
        {/* Header */}
        <div className="px-6 py-5 border-b">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
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
                      : "text-purple-700 hover:bg-purple-500 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
