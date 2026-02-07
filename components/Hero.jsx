import Link from "next/link";
import TypedCategories from "./TopCategories";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-12 px-6 text-center">
      {/* background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl dark:bg-gray-800  rounded-xl" />

      {/* TOP MINI TITLE */}
      <div className="flex flex-col  items-center  justify-center gap-2 ">
        {/* Fixed width heading */}
        <h2 className="relative text-3xl md:text-5xl  tracking-tight text-blue-700 dark:text-gray-300 flex-shrink-0  text-center font-bold mb-3">
          Welcome to Blog
        </h2>

        {/* Typed animation */}
        <div className="text-blue-500 font-semibold flex-1 min-w-0 mb-3">
          <TypedCategories loop typeSpeed={80} backSpeed={50} />
        </div>
      </div>

      {/* MAIN TITLE */}
      <h1 className="relative text-3xl md:text-5xl font-bold tracking-tight mb-6">
        Build & Scale Your <br />
        <span className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-5">
          SaaS Product Faster
        </span>
      </h1>

      {/* DESCRIPTION */}
      <p className="relative mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
        Launch <b>AI SaaS</b>, <b>Dev Tools</b>, <b>Agency Platforms</b> or a
        <b> Premium Blog SaaS</b> with a modern UI built for growth,
        conversions, and paid users.
      </p>

      {/* TRUST BADGES */}
      <div className="relative mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span>⚡ Fast Setup</span>
        <span>🔐 Secure</span>
        <span>💳 Payments Ready</span>
        <span>📈 Scalable</span>
      </div>

      {/* CTA */}
      <div className="relative mt-12 flex flex-wrap justify-center gap-6">
        {/* Primary CTA */}
        <Link
          href="/contact"
          className="group relative px-9 py-4 rounded-2xl font-semibold text-white
    bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
    shadow-xl hover:shadow-2xl transition-all duration-300
    hover:scale-105"
        >
          <span
            className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 
      group-hover:opacity-100 transition"
          />
          <span className="relative flex items-center gap-2">
            🚀 Contact us
            <span className="group-hover:translate-x-1 transition">→</span>
          </span>
        </Link>

        {/* Secondary CTA */}
        <Link
          href="/categories"
          className="group px-9 py-4 rounded-2xl font-semibold
    border border-gray-300 dark:border-gray-700
    bg-white/60 dark:bg-zinc-900/60 backdrop-blur
    hover:bg-gray-100 dark:hover:bg-zinc-800
    transition-all duration-300 hover:scale-105"
        >
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Explore Categories
            <span className="opacity-0 group-hover:opacity-100 transition">
              →
            </span>
          </span>
        </Link>
      </div>

      {/* ================= HERO CARDS ================= */}
      <div className="relative mt-20 max-w-6xl mx-auto grid md:grid-cols-2 grid-cols-1  lg:grid-cols-4 gap-6">
        {heroCards.map((card, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 bg-white dark:bg-zinc-900 shadow 
            hover:shadow-xl hover:-translate-y-1 transition md:text-left text-center"
          >
            <div className="text-3xl">{card.icon}</div>
            <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= DATA ================= */

const heroCards = [
  {
    icon: "🤖",
    title: "AI SaaS",
    desc: "Launch AI tools, chatbots & automation products.",
  },
  {
    icon: "🛠️",
    title: "Dev Tools",
    desc: "APIs, dashboards & tools for developers.",
  },
  {
    icon: "🏢",
    title: "Agency SaaS",
    desc: "Client portals, CRM & management platforms.",
  },
  {
    icon: "📝",
    title: "Blog SaaS",
    desc: "Paid blogs, content platforms & communities.",
  },
];
