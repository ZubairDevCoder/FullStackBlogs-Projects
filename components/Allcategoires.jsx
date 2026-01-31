import { getAllCategory } from "@/lib/firebase/category/read_server";
import Image from "next/image";
import Link from "next/link";

export default async function AllCategory() {
  const categories = await getAllCategory();

  return (
    <section className="relative py-20 px-6">
      {/* Section Heading */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Explore Categories
          </span>
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          AI SaaS, Dev Tools, Agency platforms & Blog systems — everything you
          need to build, scale, and monetize.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
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
              hover:-translate-y-2 hover:border-purple-500"
              style={{
                animation: `fadeUp 0.6s ease forwards`,
                animationDelay: `${index * 0.05}s`,
                opacity: 0,
              }}
            >
              {/* Icon */}
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
                  className="object-contain p-3"
                />
              </div>

              {/* Name */}
              <span
                className="text-sm font-semibold text-gray-700 dark:text-gray-200
                group-hover:text-purple-600 transition"
              >
                {category.name}
              </span>

              {/* Hover hint */}
              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
                View Posts →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
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

      {/* Animations */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
