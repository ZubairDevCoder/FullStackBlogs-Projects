"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // tumhara firebase config
import Image from "next/image";
import Link from "next/link";

export default function AllCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCategories(data);
      } catch (err) {
        console.error("Categories fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="relative py-10 px-6">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Explore Categories
          </span>
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          AI SaaS, Dev Tools, Agency platforms & Blog systems — everything you
          need to build, scale, and monetize.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group"
            >
              <div
                className="relative flex flex-col items-center gap-4 px-3 py-3 rounded-2xl
                  bg-white/70 dark:bg-zinc-900/70 backdrop-blur
                  border border-gray-200/50 dark:border-gray-800
                  shadow-md hover:shadow-xl
                  transition-all duration-300
                  hover:-translate-y-2 hover:border-purple-500 text-center"
                style={{
                  animation: `fadeUp 0.6s ease forwards`,
                  animationDelay: `${index * 0.05}s`,
                  opacity: 0,
                }}
              >
                <div
                  className="relative w-20 h-20 rounded-2xl overflow-hidden
                    bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20
                    flex items-center justify-center
                    group-hover:scale-110 transition-transform duration-300"
                >
                  <Image
                    src={category.iconURL}
                    alt={category.name}
                    fill
                    loading="lazy"
                    className="object-contain p-3"
                  />
                </div>

                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-purple-600 transition">
                  {category.name}
                </span>

                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
                  View Posts →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-20 text-center">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl
            bg-gradient-to-r from-blue-600 to-purple-600
            text-white font-semibold shadow-lg
            hover:scale-105 transition"
        >
          📂 View All Categories →
        </Link>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
