"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Tag, Calendar } from "lucide-react";

export default function PostsByCategory() {
  const [categories, setCategories] = useState([]);
  const [postsByCategory, setPostsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ Fetch categories
    const unsubCategories = onSnapshot(collection(db, "categories"), (snap) => {
      const catData = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(catData);
    });

    // 2️⃣ Fetch posts per category, limit 3 per category
    const unsubPosts = categories.map((cat) => {
      const q = query(collection(db, "posts"), limit(3));
      return onSnapshot(q, (snap) => {
        const catPosts = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => p.categoryId === cat.id); // only posts of this category
        setPostsByCategory((prev) => ({ ...prev, [cat.id]: catPosts }));
        setLoading(false);
      });
    });

    return () => {
      unsubPosts.forEach((u) => u());
      unsubCategories();
    };
  }, [categories]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">Loading posts...</div>
    );

  return (
    <section className="py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-12">
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Posts by Category
        </span>
        <p className="text-center text-xl text-gray-600 mb-8">
          Practical guides written with real development experience.
        </p>
      </h1>

      {categories.map((cat) => (
        <div key={cat.id} className="mb-16">
          {/* Category Name Centered */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-indigo-800 dark:text-gray-200">
            {cat.name}
          </h2>

          {/* Posts Grid (max 3 posts) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(postsByCategory[cat.id] || []).map((post) => {
              const createdAt = post.createdAt?.seconds
                ? new Date(post.createdAt.seconds * 1000)
                : null;
              return (
                <Card
                  key={post.id}
                  className="group relative dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-700/40 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative w-full h-48 rounded-xl overflow-hidden">
                    <Image
                      src={post.iconURL || "/placeholder.png"}
                      alt={post.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <CardHeader className="px-3 py-2">
                    <CardTitle className="line-clamp-1 text-lg font-bold text-purple-700 dark:text-white">
                      {post.name}
                    </CardTitle>
                    {createdAt && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-4 h-4 text-yellow-500" />
                        {createdAt.toLocaleDateString()}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-3 px-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-500" />
                        <span>{post.authorName || "Admin"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4.5 h-4.5 text-green-500" />
                        <span className="italic text-purple-500">
                          {cat.name}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3">
                      {post.content?.replace(/<[^>]+>/g, "")}
                    </p>

                    <Link href={`/posts/${post.id}`}>
                      <Button size="sm" className="w-full mt-2">
                        Read More →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* View All Posts Button for this category */}
          <div className="mt-6 text-center">
            <Link href={`/categories/${cat.id}`}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition">
                📄 View All Posts →
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
