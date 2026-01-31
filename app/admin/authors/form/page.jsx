"use client";

import { useRouter } from "next/navigation";
import { useAuthorsForm } from "./contexts/AuthorsFormContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Force client-side rendering
export const dynamic = "force-dynamic";

// ================= FORM =================
function AuthorsFormContent({ authorId }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useAuthorsForm();

  const [preview, setPreview] = useState(null);

  // ===== LOAD DATA (EDIT) =====
  useEffect(() => {
    if (!authorId) return;

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "authors", authorId));
        if (!snap.exists()) {
          toast.error("Author not found");
          return;
        }

        const data = snap.data();
        reset({
          name: data.name,
          email: data.email || "",
          image: null,
        });
        setPreview(data.iconURL);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load author");
      }
    };

    load();
  }, [authorId, reset]);

  // ===== IMAGE PREVIEW =====
  const imageFiles = watch("image");
  useEffect(() => {
    if (!imageFiles?.[0]) return;
    const url = URL.createObjectURL(imageFiles[0]);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFiles]);

  // ===== SUBMIT =====
  const submitHandler = async (data) => {
    try {
      const docId = authorId || nanoid();
      let imageUrl = preview;

      if (data.image?.[0]) {
        const imageRef = ref(storage, `authors/${docId}`);
        await uploadBytes(imageRef, data.image[0]);
        imageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(
        doc(db, "authors", docId),
        {
          name: data.name,
          email: data.email,
          iconURL: imageUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      toast.success(authorId ? "Author updated" : "Author created");
      router.push("/admin/authors");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Something went wrong");
    }
  };

  return (
    <Card className="w-full mx-4 my-4 h-fit overflow-hidden">
      <CardHeader>
        <CardTitle>{authorId ? "Edit Author" : "Create Author"}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {/* Full Name */}
          <div>
            <Label>Full Name</Label>
            <Input
              placeholder="Enter full name"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="author@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              })}
              disabled={!!authorId}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <Label>Image</Label>
            <Input type="file" {...register("image")} />
            {preview && (
              <div className="mt-2 w-32 h-32">
                <img
                  src={preview}
                  alt="Author Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : authorId
                ? "Update Author"
                : "Create Author"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ================= PAGE =================
// Instead of useSearchParams(), receive `searchParams` as prop
export default function Page({ searchParams }) {
  const authorId = searchParams?.id || null;
  return <AuthorsFormContent authorId={authorId} />;
}
