"use client";

import { useEffect, useState } from "react";
import {
  PostsFormContextProvider,
  usePostsForm,
} from "./contexts/PostsFormContext";
import TipTap from "./components/TipTap";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ================= POSTS FORM =================
function PostsForm({ postId }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    onSubmit,
  } = usePostsForm();

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [existingImageURL, setExistingImageURL] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tipTapContent, setTipTapContent] = useState("");

  const router = useRouter();

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const [authorsSnap, categoriesSnap] = await Promise.all([
          getDocs(collection(db, "authors")),
          getDocs(collection(db, "categories")),
        ]);

        setAuthors(authorsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setCategories(
          categoriesSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        );

        if (postId) {
          const postSnap = await getDoc(doc(db, "posts", postId));
          if (postSnap.exists()) {
            const data = postSnap.data();
            reset({
              name: data.name,
              slug: data.slug,
              content: data.content,
              categoryId: data.categoryId || "",
              authorId: data.authorId || "",
              image: null,
            });
            setTipTapContent(data.content || "");
            setExistingImageURL(data.iconURL || null);
          }
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load authors or categories");
      }
    };
    loadData();
  }, [postId, reset]);

  // ---------------- IMAGE PREVIEW ----------------
  const imageFiles = watch("image");
  useEffect(() => {
    if (imageFiles?.[0]) {
      const url = URL.createObjectURL(imageFiles[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [imageFiles]);

  // ---------------- SLUG ----------------
  const generateSlug = (v) =>
    v
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") || "default-slug";

  // ---------------- SUBMIT ----------------
  const submitHandler = async (data) => {
    try {
      const selectedAuthor = authors.find((a) => a.id === data.authorId);
      const selectedCategory = categories.find((c) => c.id === data.categoryId);

      if (!selectedAuthor || !selectedCategory) {
        return toast.error("Please select both author and category");
      }

      const payload = {
        name: data.name,
        slug: data.slug,
        content: data.content,
        authorName: selectedAuthor.name,
        authorId: selectedAuthor.id,
        categoryName: selectedCategory.name,
        categoryId: selectedCategory.id,
        image: data.image,
      };

      await onSubmit(payload, existingImageURL);

      toast.success(
        postId ? "Post updated successfully" : "Post created successfully",
      );

      reset();
      setPreview(null);
      setTipTapContent("");
      router.push("/admin/posts");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Something went wrong");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{postId ? "Edit Post" : "Create New Post"}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 lg:flex-row w-full">
        <div className="flex-1">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-5 w-full"
          >
            {/* TITLE */}
            <div>
              <Label>Post Title</Label>
              <Input
                placeholder="Enter post title"
                {...register("name", {
                  required: "Title is required",
                  minLength: { value: 5, message: "Minimum 5 characters" },
                  maxLength: { value: 100, message: "Maximum 100 characters" },
                  onChange: (e) =>
                    setValue("slug", generateSlug(e.target.value)),
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* SLUG */}
            <div>
              <Label>Slug</Label>
              <Input
                placeholder={postId ? "" : "auto-generated-slug"}
                {...register("slug", {
                  required: "Slug is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                  maxLength: { value: 50, message: "Maximum 50 characters" },
                })}
                disabled={!!postId}
              />
              {errors.slug && (
                <p className="text-red-500 text-sm">{errors.slug.message}</p>
              )}
            </div>

            {/* CATEGORY */}
            <div>
              <Label>Category</Label>
              <Select
                value={watch("categoryId") || ""}
                onValueChange={(v) => setValue("categoryId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AUTHOR */}
            <div>
              <Label>Author</Label>
              <Select
                value={watch("authorId") || ""}
                onValueChange={(v) => setValue("authorId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* IMAGE */}
            <div>
              <Label>Image</Label>
              <Input type="file" {...register("image")} />
              {(preview || existingImageURL) && (
                <img
                  src={preview || existingImageURL}
                  className="w-32 h-32 mt-2 rounded object-cover"
                />
              )}
            </div>

            <Button className="w-full" disabled={isSubmitting}>
              {postId ? "Update Post" : "Create Post"}
            </Button>
          </form>
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <Label>Content</Label>
          <TipTap
            value={tipTapContent}
            onChange={(html) => {
              setTipTapContent(html);
              setValue("content", html);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ================= PAGE =================
// ✅ use `searchParams` prop instead of useSearchParams
// ✅ Page must be async to unwrap searchParams
export default async function Page({ searchParams }) {
  // 🔹 unwrap searchParams
  const params = await searchParams;
  const postId = params?.id || null;
hy
  return (
    <PostsFormContextProvider>
      <PostsForm postId={postId} />
    </PostsFormContextProvider>
  );
}
