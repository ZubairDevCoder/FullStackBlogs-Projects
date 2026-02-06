"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Tag, Calendar } from "lucide-react";

export default function AllPostsPage() {
  const [categories, setCategories] = useState([]);
  const [postsByCategory, setPostsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubCategories = onSnapshot(collection(db, "categories"), (snap) => {
      const catData = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(catData);
    });

    const unsubPosts = onSnapshot(collection(db, "posts"), (snap) => {
      const allPosts = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const grouped = {};
      allPosts.forEach((post) => {
        const catId = post.categoryId || "uncategorized";
        if (!grouped[catId]) grouped[catId] = [];
        grouped[catId].push(post);
      });
      setPostsByCategory(grouped);
      setLoading(false);
    });

    return () => {
      unsubCategories();
      unsubPosts();
    };
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">Loading posts...</div>
    );

  const renderPosts = (posts) =>
    posts.map((post) => {
      const createdAt = post.createdAt?.seconds
        ? new Date(post.createdAt.seconds * 1000)
        : null;

      return (
        <Card
          key={post.id}
          className="group dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-700/40 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
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
    });

  return (
    <section className="py-8 px-6">
      <h1 className="text-4xl font-bold text-center mb-12">
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          All Posts
        </span>
        <p className="text-center text-gray-600 my-3 text-xl">
          Practical guides written with real development experience.
        </p>
      </h1>
      {/* Courses */}
      <section className="max-w-5xl mx-auto px-4   my-4 mb-8 ">
        <h1 className="text-2xl  font-bold text-gray-800 dark:text-white mb-4 text-center">
          Full Stack Development Roadmap & Course
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
          Explore this comprehensive full stack development course that covers
          the complete roadmap: HTML, CSS, JavaScript, React, Next.js,Shadcn Ui, Node.js,
          Express, MongoDB and Tailwind CSS. Start learning and building
          professional web applications today.
        </p>
        <div className="flex justify-center">
          <Link
            href="https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w"
            target="_blank"
            className="inline-block"
          >
            <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transform transition duration-300">
              Full Stack Development Course
            </Button>
          </Link>
        </div>
      </section>
      {categories.map((cat) => (
        <div key={cat.id} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-indigo-800 dark:text-gray-200">
            {cat.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderPosts(postsByCategory[cat.id] || [])}
          </div>
        </div>
      ))}

      {postsByCategory["uncategorized"]?.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
            Uncategorized
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderPosts(postsByCategory["uncategorized"])}
          </div>
        </div>
      )}
    </section>
  );
}
