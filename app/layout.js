import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/darkMode";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Poppins } from "next/font/google";

/* ✅ FAST GOOGLE FONTS (NO render-blocking) */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

/* ✅ STRONG SEO METADATA */
export const metadata = {
  metadataBase: new URL("https://full-stack-blogs-projects.vercel.app"),

  title: {
    default:
      "ZubairDevCoder Blog | Full Stack, AI, React, Next.js & Modern Web",
    template: "%s | ZubairDevCoder Blog",
  },

  description:
    "ZubairDevCoder Blog – Learn Full Stack Development, React, Next.js, Firebase, AI, Machine Learning, Blockchain, DevOps, Cloud Computing, and Cyber Security with real-world projects and tutorials.",

  keywords: [
    "ZubairDevCoder",
    "Full Stack Development",
    "React.js",
    "Next.js",
    "Firebase",
    "Artificial Intelligence",
    "Machine Learning",
    "Blockchain Development",
    "Cloud Computing",
    "Cyber Security",
  ],

  authors: [{ name: "Zubair Dev Coder" }],
  creator: "Zubair Dev Coder",

  openGraph: {
    title: "ZubairDevCoder Blog | Full Stack, AI & Modern Web Development",
    description:
      "Step-by-step tutorials on Full Stack Development, AI, Machine Learning, Blockchain, Cloud & DevOps.",
    url: "/",
    siteName: "ZubairDevCoder Blog",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZubairDevCoder Tech Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ZubairDevCoder Blog | Full Stack, AI & Next.js",
    description:
      "Learn Full Stack Development, AI & Modern Web UI with practical tutorials.",
    images: ["/og-image.png"],
  },

  verification: {
    google: "googlee2480a318705e5c1",
  },

  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <head>
          <meta
            name="google-site-verification"
            content="v8MZvG8XOHVTu6bd_307APE4IvEwf7MXBp1eO0945iI"
          />
        </head>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* HEADER */}
          <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
            <Navbar />
          </header>

          {/* MAIN CONTENT */}
          <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
            {children}
          </main>

          {/* FOOTER */}
          <Footer />

          {/* UI UTILITIES */}
          <ModeToggle />
          <Toaster position="top-center" />

          {/* ANALYTICS */}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
