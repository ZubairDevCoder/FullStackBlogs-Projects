"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { motion } from "framer-motion";
import { FileText, Layers, Users, Shield } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

/* ===============================
   Cards Config (SaaS Metrics)
================================*/
const COUNT_CARDS = [
  {
    title: "Total Posts",
    desc: "Published content",
    path: "posts",
    icon: FileText,
    href: "/admin/posts",
  },
  {
    title: "Categories",
    desc: "Active niches",
    path: "categories",
    icon: Layers,
    href: "/admin/categories",
  },
  {
    title: "Authors",
    desc: "Content creators",
    path: "authors",
    icon: Users,
    href: "/admin/authors",
  },
  {
    title: "Admins",
    desc: "Platform managers",
    path: "admins",
    icon: Shield,
    href: "/admin/useradmins",
  },
];

/* ===============================
   Realtime Count Hook
================================*/
function useRealtimeCount(path) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, path);

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setCount(snapshot.size);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path]);

  return { count, loading };
}

/* ===============================
   Main Component
================================*/
export default function CountCardTotal() {
  return (
    <section className="space-y-10">
      {/* ================= HOOK ================= */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl  font-bold">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            SaaS Growth Dashboard
          </span>
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Real-time insights across your <b>AI SaaS</b>, <b>Dev Tools</b>,
          <b> Agency Platforms</b> & <b>Blog SaaS</b>.
        </p>
      </div>

      {/* ================= METRIC CARDS ================= */}
      <div className="grid grid-cols-1 text-center md:text-left  md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COUNT_CARDS.map((item, index) => {
          const { count, loading } = useRealtimeCount(item.path);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <Card
                  className="group cursor-pointer backdrop-blur
                  bg-white/70 dark:bg-zinc-900/70
                  border border-gray-200/50 dark:border-gray-800
                  shadow-md hover:shadow-xl
                  transition-all duration-300
                  hover:-translate-y-1"
                >
                  <CardContent className="flex items-center md:justify-start justify-center gap-4 px-2 py-2">
                    {/* Icon */}
                    <div
                      className="p-4 rounded-2xl
                      bg-gradient-to-br from-blue-500/15 via-purple-500/15 to-pink-500/15
                      text-purple-600 dark:text-purple-400
                      group-hover:scale-110 transition"
                    >
                      <Icon size={28} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.title}
                      </p>
                      <h3 className="text-3xl font-extrabold tracking-tight">
                        {loading ? "—" : count}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                    </div>

                    {/* Arrow */}
                    <span className="text-gray-300 group-hover:text-purple-500 transition">
                      →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
