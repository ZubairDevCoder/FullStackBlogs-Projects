
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/darkMode";


export const metadata = {
  title:
    "ZubairDevCoder Blog | Full Stack Development, React, Next.js & Modern UI",
  description:
    "ZubairDevCoder Blog – Learn Full Stack Web Development, React, Next.js, Firebase, Shadcn UI, Tailwind CSS, Figma, Postman, and Modern UI/UX Design. Step-by-step coding tutorials, SEO-friendly tips, and practical projects for developers.",
  keywords: [
    "ZubairDevCoder",
    "Full Stack Development",
    "React JS",
    "Next.js",
    "Firebase",
    "Shadcn UI",
    "Tailwind CSS",
    "Figma",
    "Postman",
    "Modern UI Design",
    "Web Development Tutorials",
    "Coding Projects",
    "SEO-friendly web apps",
  ],
  authors: [{ name: "ZubairDevCoder" }],
  openGraph: {
    title: "ZubairDevCoder Blog | Full Stack Development, React, Next.js",
    description:
      "Step-by-step coding tutorials, projects, and modern UI design tips by ZubairDevCoder. Learn React, Next.js, Firebase, Tailwind, Shadcn UI, and build SEO-friendly apps.",
    url: "https://full-stack-blogs-projects.vercel.app/", // replace with your live site
    siteName: "ZubairDevCoder Blog",
    images: [
      {
        url: "/og-image.png", // create an OG image
        width: 1200,
        height: 630,
        alt: "ZubairDevCoder Blog - Full Stack Development",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZubairDevCoder Blog | Full Stack Development, React, Next.js",
    description:
      "Learn Full Stack Development, React, Next.js, Firebase, Tailwind CSS, and Modern UI Design with ZubairDevCoder.",
    images: ["/og-image.png"], // same OG image
    creator: "@ZubairDevCoder",
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased dark:bg-gray-800 scrollbar-hide overflow-y-scroll">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50  shadow-lg bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-800 mb-5 ">
            <Navbar />
          </header>
          <main className="max-w-7xl mx-auto scrollbar-hide overflow-hidden ">
            {children}
          </main>
          {/* Dark/Light Toggle */}
          <div className="fixed bottom-6 right-6 z-50 ">
            <ModeToggle />
          </div>
          <Toaster position="top-center" />
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
