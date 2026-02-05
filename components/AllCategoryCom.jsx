"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

export default function AllCategoryCom() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "categories"), limit(6));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCategories(data);
        setLoading(false);
      },
      (err) => {
        console.error("Categories fetch error:", err);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">
        Loading categories...
      </div>
    );
  if (!categories.length)
    return (
      <div className="text-center py-10 text-gray-500">
        No categories available
      </div>
    );

  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Explore Categories
        </span>
      </h2>
      <p className="my-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-center ">
        AI SaaS, Dev Tools, Agency platforms & Blog systems — everything you
        need to build, scale, and monetize.
      </p>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.id}`} className="group">
            <div className="relative flex flex-col items-center gap-4 px-3 py-3 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur border border-gray-200/50 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-500 text-center">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={cat.iconURL}
                  alt={cat.name}
                  fill
                  className="object-contain p-3"
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-purple-600 transition">
                {cat.name}
              </span>
              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
                View Posts →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          📂 View All Categories →
        </Link>
      </div>
    </section>
  );
}
