import AllPost from "@/components/PostsListView";
import AllCategory from "@/components/Allcategoires";
import TypedCategories from "@/components/TopCategories";
import Hero from "@/components/Hero";

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-6  py-8 space-y-16  ">
      <div className="text-center  space-y-4">
        <Hero />
      </div>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-12 md:p-20 text-center">
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-400/30 blur-3xl rounded-full"></div>
        <div className="absolute top-10 -right-24 w-96 h-96 bg-blue-400/30 blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <span className="inline-block px-5 py-2 rounded-full bg-white/70 dark:bg-gray-900/60 backdrop-blur text-sm font-semibold text-purple-700 dark:text-purple-400 shadow">
            🚀 Modern Developer Blog
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            <span className="block text-gray-800 dark:text-gray-100">
              Build Skills That Matter
            </span>
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-3xl ">
              Learn <TypedCategories />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            High-quality tutorials, real-world projects, and career-focused
            content for developers who want to build production-ready
            applications.
          </p>

          {/* CTA Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <span className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium shadow">
              🚀 Real Projects
            </span>
            <span className="px-5 py-2 rounded-full bg-purple-600 text-white font-medium shadow">
              ⚛️ Modern Stack
            </span>
            <span className="px-5 py-2 rounded-full bg-pink-600 text-white font-medium shadow">
              💼 Career Focused
            </span>
            <span className="px-5 py-2 rounded-full bg-green-600 text-white font-medium shadow">
              🔥 Industry Practices
            </span>
          </div>
        </div>
      </section>

      {/* ================= TOP TOPICS ================= */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-gray-800 dark:text-white">
          High-Demand Topics You’ll Master
        </h2>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1  gap-8">
          {[
            {
              title: "🚀 Full-Stack Web Development",
              desc: "Learn frontend + backend together and build complete scalable web apps.",
            },
            {
              title: "⚛️ React & Next.js Mastery",
              desc: "Components, routing, SSR/SSG, and performance optimization.",
            },
            {
              title: "🔥 Firebase & Backend Systems",
              desc: "Auth, Firestore, storage, and serverless backend practices.",
            },
            {
              title: "🧠 JavaScript Deep Dive",
              desc: "Advanced JS concepts, closures, async/await, and architecture patterns.",
            },
            {
              title: "🎨 Modern UI / UX Design",
              desc: "Clean, responsive, and professional interfaces using TailwindCSS.",
            },
            {
              title: "🤖 AI Tools for Developers",
              desc: "Integrate AI-powered tools to boost productivity and apps.",
            },
            {
              title: "💼 Freelancing & Career Growth",
              desc: "Build portfolios, find clients, and grow your tech career professionally.",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition"
            >
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ================= CATEGORIES ================= */}
      <section>
        <AllCategory />
      </section>
      {/* ================= POSTS ================= */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-4 text-purple-600 dark:text-white">
          Featured Posts
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Practical guides written with real development experience.
        </p>
        <AllPost />
      </section>

      {/* ================= FINAL HOOK + EXTRA TOPICS ================= */}
      <section className="max-w-5xl mx-auto text-center space-y-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
          Additional Topics You’ll Gain Expertise In
        </h2>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-xl transition">
            <h3 className="font-bold text-lg mb-2">🌐 API Integration</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Learn REST & GraphQL APIs and integrate them with your apps.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-xl transition">
            <h3 className="font-bold text-lg mb-2">
              🔒 Security Best Practices
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Keep your apps safe with authentication, authorization, and secure
              coding.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-xl transition">
            <h3 className="font-bold text-lg mb-2">⚙️ DevOps & Deployment</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Deploy apps using Vercel, Netlify, Docker, and CI/CD pipelines.
            </p>
          </div>
        </div>

        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8">
          🚀 Start exploring tutorials, pick a category, and take your developer
          skills to the next level today.
        </p>
      </section>
    </div>
  );
}
