"use client";

import { useForm } from "react-hook-form";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "contact"), {
        full_name: data.full_name,
        email: data.email,
        message: data.message,
        createdAt: serverTimestamp(),
      });

      toast.success("Message sent successfully 🚀");
      reset();

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <main className="relative min-h-screen px-6 py-24 bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* ================= BACKGROUND GLOW ================= */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

      {/* ================= HERO / HOOK ================= */}
      <section className="relative max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          <span className="text-purple-700 dark:text-white">
            Let’s Build Something
          </span>
          <br />
          Amazing Together
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Have an idea for an <b>AI SaaS</b>, <b>Developer Tool</b>,
          <b> Agency Platform</b> or <b>Blog SaaS</b>? Let’s turn it into a
          scalable, revenue-generating product.
        </p>

        {/* Trust Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>🤖 AI-Ready</span>
          <span>💳 Monetizable</span>
          <span>🚀 Startup Friendly</span>
          <span>📈 Scalable</span>
        </div>
      </section>

      {/* ================= FORM CARD ================= */}
      <section className="relative flex justify-center">
        <Card
          className="w-full max-w-xl backdrop-blur bg-white/70 dark:bg-zinc-900/70
          border border-gray-200/50 dark:border-gray-800
          shadow-xl animate-fadeUp"
        >
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Contact Our Team
            </CardTitle>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              We usually reply within 24 hours 🚀
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1">
                <Label>Full Name</Label>
                <Input
                  placeholder="Your full name"
                  {...register("full_name", {
                    required: "Full Name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                  })}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1">
                <Label>Project Details</Label>
                <Textarea
                  rows={5}
                  placeholder="Tell us about your idea, goals, or product..."
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 10, message: "Minimum 10 characters" },
                  })}
                />
                {errors.message && (
                  <p className="text-sm text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r 
                from-blue-600 to-purple-600 hover:scale-[1.02] transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message 🚀"}
              </Button>

              {/* Micro Trust */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                No spam · Your data is safe · Confidential discussion
              </p>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* ================= ANIMATION ================= */}
      <style>{`
        .animate-fadeUp {
          animation: fadeUp 0.6s ease forwards;
        }
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
