"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Tag, Calendar } from "lucide-react";
import Image from "next/image";

export default function AllPost() {
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Realtime listener for posts
  useEffect(() => {
    const unsubscribePosts = onSnapshot(collection(db, "posts"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    });

    const unsubscribeAuthors = onSnapshot(collection(db, "authors"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAuthors(data);
    });

    const unsubscribeCategories = onSnapshot(
      collection(db, "categories"),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCategories(data);
        setLoading(false);
      },
    );

    return () => {
      unsubscribePosts();
      unsubscribeAuthors();
      unsubscribeCategories();
    };
  }, []);

  const authorsMap = authors.reduce((acc, author) => {
    acc[author.id] = author;
    return acc;
  }, {});

  const categoriesMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <h3 className="text-xl font-semibold text-muted-foreground">
          Posts Not Available
        </h3>
      </div>
    );
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-2">
      {posts.map((post) => {
        const createdAt = post.createdAt?.toDate
          ? post.createdAt.toDate()
          : post.createdAt || null;
        const updatedAt = post.updatedAt?.toDate
          ? post.updatedAt.toDate()
          : post.updatedAt || null;

        const author = authorsMap[post.authorId] || null;
        const category = categoriesMap[post.categoryId] || null;

        return (
          <Card
            key={post.id}
            className="group relative dark:bg-gray-900/40
              backdrop-blur-md border border-white/20
              dark:border-gray-700/40 rounded-xl
              overflow-hidden shadow-lg hover:shadow-2xl
              transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative w-full h-50 p-0.5 rounded-xl overflow-hidden">
              <Image
                src={post.iconURL}
                alt={post.name}
                fill
                loading="lazy"
                className="object-contain"
              />
            </div>

            <CardHeader className="px-3 py-2">
              <CardTitle className="line-clamp-1 text-lg font-bold text-purple-700 dark:text-white">
                {post.name}
              </CardTitle>

              <div className="flex flex-col gap-1 text-xs text-gray-500">
                {createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-yellow-500 dark:text-white" />
                    Created: {createdAt.toLocaleDateString()}{" "}
                    {createdAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                {updatedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-green-500 dark:text-white" />
                    Updated: {updatedAt.toLocaleDateString()}{" "}
                    {updatedAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 px-4">
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  {author?.iconURL ? (
                    <img
                      src={author.iconURL}
                      alt={author.name}
                      className="w-7.5 h-7.5 rounded-full object-contain border"
                    />
                  ) : (
                    <User className="w-5 h-5 text-blue-500" />
                  )}
                  <span>{author?.name || post.authorName || "Admin"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="w-4.5 h-4.5 text-green-500 dark:text-white" />
                  <span className="italic text-purple-500">
                    {category?.name || post.categoryName || "General"}
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
