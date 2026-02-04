"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; // aapka firebase config
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Tag, Calendar } from "lucide-react";

export default function AllPostsHome() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 Realtime listener for posts collection
    const unsubscribe = onSnapshot(collection(db, "posts"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Loading posts...</div>
    );
  }

  if (!posts.length) {
    return (
      <div className="flex justify-center py-20">
        <h3 className="text-xl font-semibold text-gray-500">
          No Posts Available
        </h3>
      </div>
    );
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
      {posts.map((post) => {
        const createdAt = post.createdAt?.seconds
          ? new Date(post.createdAt.seconds * 1000)
          : null;
        const updatedAt = post.updatedAt?.seconds
          ? new Date(post.updatedAt.seconds * 1000)
          : null;

        return (
          <Card
            key={post.id}
            className="group relative dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-700/40 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Optimized Image */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden">
              <Image
                src={post.iconURL || "/placeholder.png"}
                alt={post.name}
                fill
                className="object-contain"
                priority={true} // home page ke liye important
              />
            </div>

            <CardHeader className="px-3 py-2">
              <CardTitle className="line-clamp-1 text-lg font-bold text-purple-700 dark:text-white">
                {post.name}
              </CardTitle>
              <div className="flex flex-col gap-1 text-xs text-gray-500">
                {createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-yellow-500" />
                    {createdAt.toLocaleDateString()}
                  </span>
                )}
                {updatedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-green-500" />
                    {updatedAt.toLocaleDateString()}
                  </span>
                )}
              </div>
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
                    {post.categoryName || "General"}
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
    </main>
  );
}
