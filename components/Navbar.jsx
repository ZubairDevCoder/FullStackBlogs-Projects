"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  House,
  List,
  MessageCircle,
  Menu,
  LayoutDashboard,
  FileText,
} from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { loadLordicon } from "./loadLordicon";
import Profile from "./Profile";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// 🔹 COMMON LINKS (Dashboard excluded)
const baseLinks = [
  { name: "Home", href: "/", icon: House },
  { name: "Posts", href: "/allposts", icon: FileText },
  { name: "Categories", href: "/categories", icon: List },
  { name: "Contact", href: "/contact", icon: MessageCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  loadLordicon();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔥 Auth + Admin Check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);

      if (!u?.email) {
        setIsAdmin(false);
        return;
      }

      try {
        const adminRef = doc(db, "admins", u.email.toLowerCase());
        const snap = await getDoc(adminRef);
        setIsAdmin(snap.exists());
      } catch (err) {
        console.error("Admin check failed:", err);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-1.5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 ">
          <Image
            src="/codingblog.png"
            alt="Coding Blog Logo"
            width={70} // logo ki width
            height={20} // navbar ke hisaab se height
            priority
            className=" object-contain transition-transform duration-300 hover:scale-105 dark:invert"
          />
        </Link>

        {/* DESKTOP LINKS */}
        <ul className="hidden md:flex items-center gap-10">
          {[
            ...baseLinks,
            ...(isAdmin ? [{ name: "Dashboard", href: "/admin" }] : []),
          ].map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 text-lg  font-bold transition-all duration-300
            ${
              isActive
                ? "text-purple-600 dark:text-white"
                : "text-gray-700 dark:text-gray-300 hover:text-purple-500 hover:scale-105"
            }`}
                >
                  {link.name}

                  <span
                    className={`absolute left-0 -bottom-1 h-1 w-full rounded-full bg-purple-500
              transition-transform duration-300 ease-out origin-left
              ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* PROFILE */}
          <div className="md:block hidden">
            {user ? (
              user.image ? (
                <Profile />
              ) : (
                <div
                  title={user.name || "User"} // fallback title
                >
                  <Profile />
                  {/* fallback initial if name is missing */}
                </div>
              )
            ) : (
              <Link href="/account" className="p-2">
                <lord-icon
                  src="https://cdn.lordicon.com/kdduutaw.json"
                  trigger="hover"
                  className="dark:invert"
                  style={{ width: 32, height: 32 }}
                />
              </Link>
            )}
          </div>

          {/* MOBILE MENU */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="bg-white dark:bg-gray-900">
                <Link href="/" className="flex items-center gap-2 px-4 pt-1">
                  <Image
                    src="/codingblog.png"
                    alt="Coding Blog Logo"
                    width={70} // logo ki width
                    height={20} // navbar ke hisaab se height
                    priority
                    className=" object-contain dark:invert"
                  />
                </Link>

                <div className="flex justify-center py-2">
                  {user ? <Profile /> : <Link href="/account">Sign In</Link>}
                </div>

                <div className="flex flex-col gap-5 px-4 py-4">
                  {[
                    ...baseLinks,
                    ...(isAdmin
                      ? [
                          {
                            name: "Dashboard",
                            href: "/admin",
                            icon: LayoutDashboard,
                          },
                        ]
                      : []),
                  ].map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center gap-3 text-base
                          ${
                            isActive
                              ? "text-purple-600 font-semibold"
                              : "text-gray-600 dark:text-gray-300 hover:text-purple-500"
                          }`}
                      >
                        <Icon size={20} />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
