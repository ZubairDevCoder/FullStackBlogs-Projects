"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  CategoriesFormContextProvider,
  useCategoryForm,
} from "./contexts/CategoriesFormContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

// ================= FORM =================
function CategoryFormContent({ categoryId }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useCategoryForm();

  const [preview, setPreview] = useState(null);

  // 🔹 LOAD DATA FOR EDIT
  useEffect(() => {
    if (!categoryId) return;

    const loadCategory = async () => {
      const snap = await getDoc(doc(db, "categories", categoryId));
      if (!snap.exists()) {
        toast.error("Category not found");
        return;
      }

      const data = snap.data();
      reset({
        name: data.name,
        slug: data.slug,
        image: null,
      });
      setPreview(data.iconURL);
    };

    loadCategory();
  }, [categoryId, reset]);

  // 🔹 IMAGE PREVIEW
  const imageFiles = watch("image");
  useEffect(() => {
    if (!imageFiles?.[0]) return;
    const url = URL.createObjectURL(imageFiles[0]);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFiles]);

  // 🔹 SLUG GENERATOR
  const generateSlug = (v = "") =>
    v
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

  const handleNameChange = (e) => {
    setValue("slug", generateSlug(e.target.value));
  };

  // 🔹 SUBMIT
  const submitHandler = async (data) => {
    try {
      const docId = categoryId || data.slug;
      let imageUrl = preview;

      // Upload new image if selected
      if (data.image?.[0]) {
        const imageRef = ref(storage, `categories/${docId}`);
        await uploadBytes(imageRef, data.image[0]);
        imageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(
        doc(db, "categories", docId),
        {
          name: data.name,
          slug: data.slug,
          iconURL: imageUrl || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      toast.success(categoryId ? "Category updated" : "Category created");
      router.push("/admin/categories");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Something went wrong");
    }
  };

  return (
    <Card className="w-full mx-4 my-4 h-fit">
      <CardHeader>
        <CardTitle>
          {categoryId ? "Edit Category" : "Create Category"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              placeholder="Enter category name"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
                onChange: handleNameChange,
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <Label>Slug</Label>
            <Input
              placeholder="auto-generated-slug"
              {...register("slug", {
                required: "Slug is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <Label>Image</Label>
            <Input type="file" {...register("image")} />
            {preview && (
              <div className="relative w-32 h-32 mt-2">
                <Image
                  src={preview}
                  fill
                  alt="Category Image"
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : categoryId
                ? "Update Category"
                : "Create Category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ================= PAGE =================
export default function Page() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");

  return (
    <CategoriesFormContextProvider>
      <CategoryFormContent categoryId={categoryId} />
    </CategoriesFormContextProvider>
  );
}
