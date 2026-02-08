"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, Tag } from "lucide-react";

export default function RandomPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), limit(15));
        const snap = await getDocs(q);

        let allPosts = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 🔀 Random posts
        allPosts.sort(() => 0.5 - Math.random());

        setPosts(allPosts.slice(0, 10));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Loading posts...</div>
    );
  }

  return (
    <section className="py-8 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Latest Articles
        </span>
        <p className="text-lg text-gray-600 mt-2">
          Hand-picked articles for developers 🚀
        </p>
      </h1>

      {/* POSTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          // ✅ createdAt fallback logic
          const postDate =
            post.createdAt?.toDate?.() || post.updatedAt?.toDate?.() || null;

          return (
            <Card
              key={post.id}
              className="group dark:bg-gray-900/40 border rounded-xl overflow-hidden hover:shadow-xl transition"
            >
              {/* IMAGE */}
              <div className="relative w-full h-48">
                <Image
                  src={post.iconURL || "/placeholder.png"}
                  alt={post.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* HEADER */}
              <CardHeader className="space-y-2">
                {/* TITLE */}
                <CardTitle className="line-clamp-1 text-lg font-bold text-purple-700 dark:text-white">
                  {post.name}
                </CardTitle>

                {/* TIME */}
                {postDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-4 h-4 text-green-500" />
                    {postDate.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                )}

                {/* AUTHOR + CATEGORY (FLEX + WRAP) */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
                  {/* AUTHOR */}
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>{post.authorName || "Admin"}</span>
                  </div>

                  {/* CATEGORY */}
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4 text-green-500" />
                    <span className=" italic text-purple-500">
                      {post.categoryName || "Uncategorized"}
                    </span>
                  </div>
                </div>
              </CardHeader>

              {/* CONTENT */}
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-3">
                  {post.content?.replace(/<[^>]+>/g, "")}
                </p>

                <Link href={`/posts/${post.slug || post.id}`}>
                  <Button size="sm" className="w-full">
                    Read More →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ALL POSTS BUTTON */}
      <div className="mt-12 text-center">
        <Link href="/allposts">
          <Button className="px-6 py-6 text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition">
            📚 View All Posts
          </Button>
        </Link>
      </div>
    </section>
  );
}
