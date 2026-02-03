import AllPost from "@/components/PostsListView";
import { getAllPostswithCategory } from "@/lib/firebase/posts/read_server";
import { getCategoryById } from "@/lib/firebase/category/read_server";
import Image from "next/image";
import TypedCategories from "@/components/TopCategories";

export default async function Page({ params }) {
  // ✅ Next.js 16 params async
  const { categoryId } = await params;

  // ✅ fetch category
  const category = await getCategoryById(categoryId);

  // ✅ fetch posts
  const posts = await getAllPostswithCategory(categoryId);

  return (
    <main className="px-4 py-6 space-y-4">
      {/* 🔥 CATEGORY HEADER */}
      {category && (
        <div className="flex items-center gap-4  pb-4 justify-center">
          <div className="text-center md:text-left max-w-xl mx-auto py-3 animate-fadeInUp">
            <div className="text-center  max-w-2xl mx-auto py-4 animate-fadeInUp space-y-4">
              {/* Main Hook */}
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-indigo-700 dark:text-white">
                {category.name} Category
                <br />
                <span className="text-purple-600 text-xl md:text-2xl font-medium">
                  Tutorials & Guides
                </span>
              </h1>

              {/* Subhook with typed animation */}
              <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300">
                Discover Coding Topics{" "}
                <TypedCategories
                  className="text-blue-500 font-semibold"
                  loop
                  typeSpeed={80}
                  backSpeed={50}
                />
              </h2>

              {/* Small descriptive teaser */}
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Discover the best posts, projects, and resources in{" "}
                <span className="font-semibold text-purple-600">
                  {category.name}
                </span>{" "}
                today!{" "}
                <span className="text-blue-500 font-medium">
                  Trending tools, tutorials, and SaaS insights await you.
                </span>
              </p>

              {/* Optional extra micro-hook for urgency */}
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 italic">
                Stay ahead — top trending posts updated daily.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ❌ No posts */}
      {!posts || posts.length === 0 ? (
        <div className="flex justify-center py-10">
          <h2 className="text-lg font-semibold text-purple-700 dark:text-white">
            No posts found in this category
          </h2>
        </div>
      ) : (
        <AllPost posts={posts} />
      )}
    </main>
  );
}
