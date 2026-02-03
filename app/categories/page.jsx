import TypedCategories from "@/components/TopCategories";
import { getAllCategory } from "@/lib/firebase/category/read_server";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const categories = await getAllCategory();

  return (
    <main className="relative min-h-screen px-6 py-20 bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* ================= HERO / HOOK ================= */}
      <section className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-4xl  font-bold leading-tight">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            High-Demand SaaS Categories
          </span>
          <br />
          <TypedCategories />
          <br />
          Built for Growth & Revenue
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Explore <b>AI SaaS</b>, <b>Developer Tools</b>,{" "}
          <b>Agency Platforms</b> and
          <b> Blog SaaS</b> — hand-picked categories designed to convert users
          into paying customers.
        </p>

        {/* Trust Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>🔥 Trending</span>
          <span>💳 Monetizable</span>
          <span>🚀 Startup Ready</span>
          <span>📈 Scalable</span>
        </div>
      </section>

      {/* ================= CATEGORY GRID ================= */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group"
            >
              <div
                className="relative flex flex-col items-center gap-4 px-3 py-3   rounded-2xl
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
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-purple-600 transition">
                  {category.name}
                </span>

                {/* Micro CTA */}
                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
                  View Opportunities →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mt-24 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold">
          Turn Categories into Revenue-Generating Products
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Start building AI tools, SaaS platforms & paid products today.
        </p>
      </section>

      {/* ================= ANIMATIONS ================= */}
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
    </main>
  );
}
