import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/darkMode";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
export const metadata = {
  title:
    "ZubairDevCoder Blog | Full Stack Development, React, Next.js & Modern UI",
  description:
    "ZubairDevCoder Blog – Learn Full Stack Web Development, React, Next.js, Firebase, Shadcn UI, Tailwind CSS, Figma, Postman, and Modern UI/UX Design. Step-by-step coding tutorials, SEO-friendly tips, and practical projects for developers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased dark:bg-gray-800 scrollbar-hide overflow-y-scroll overflow-hidden ">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50  shadow-lg bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-800 mb-5 overflow-hidden">
            <Navbar />
          </header>

          <main className="max-w-7xl mx-auto scrollbar-hide overflow-hidden ">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>
          {/* Dark/Light Toggle */}
          <div className="fixed bottom-6 right-6 z-50 overflow-hidden">
            <ModeToggle />
          </div>
          <Toaster position="top-center" />
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
