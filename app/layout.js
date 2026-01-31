import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/darkMode";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zubi Coder Blog | Full Stack Development, React, Next.js & Modern UI",
  description:
    "Zubi Coder Blog – Learn Full Stack Development with Next.js, React, Shadcn UI, Firebase, Figma, Postman, Tailwind CSS, Web Tips, Tutorials, and Modern UI Design for SEO-friendly apps.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-800 scrollbar-hide overflow-y-scroll`}
      >
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
