"use client";

import Link from "next/link";
import {
  House,
  List,
  MessageCircle,
  Github,
  Linkedin,
  Youtube,
  Facebook,
} from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/", icon: House },
    { name: "Categories", href: "/categories", icon: List },
    { name: "Contact", href: "/contact", icon: MessageCircle },
  ];

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const contact = [
    "Email: info@zubairdevcoder.com",
    "Phone: +92 300 1234567",
    "Address: Karachi, Pakistan",
  ];

  // 🔥 Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCategories(data);
      } catch (err) {
        console.error("Footer categories error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-slate-900 text-gray-200 py-12 mt-1">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-5 gap-10 overflow-hidden">
        {/* About */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">About</h3>
          <p className="text-sm text-gray-400">
            ZubairDevCoder Blog – Learn Full Stack Web Development with Next.js,
            React, Tailwind, Shadcn UI, Firebase, and Modern UI/UX Design.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <Link
              href="https://github.com/ZubairDevCoder"
              target="_blank"
              className="hover:text-white"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/zubair-dev-coder-11a02a3aa"
              target="_blank"
              className="hover:text-blue-600"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link
              href="https://youtube.com/@zubairdevcoder?si=ky9hmVYBqVyadDkj"
              target="_blank"
              className="hover:text-red-600"
            >
              <Youtube className="w-5 h-5" />
            </Link>
            <Link
              href="https://web.facebook.com/profile.php?id=61568318417512"
              target="_blank"
              className="hover:text-blue-500"
            >
              <Facebook className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <motion.li
                key={link.name}
                whileHover={{ x: 5, scale: 1.05, color: "#7c3aed" }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  className="relative group text-gray-200 hover:text-blue-500"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-blue-500 transition-all group-hover:w-full"></span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Categories (Dynamic) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul className="space-y-2">
            {loading && <li className="text-sm text-gray-500">Loading...</li>}
            {categories.map((cat) => (
              <motion.li
                key={cat.id}
                whileHover={{ x: 5, scale: 1.05, color: "#7c3aed" }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/categories/${cat.id}`}
                  className="relative group text-gray-200 hover:text-blue-500"
                >
                  {cat.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-blue-500 transition-all group-hover:w-full"></span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            {contact.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} ZubairDevCoder. All rights reserved.
      </div>
    </footer>
  );
}
