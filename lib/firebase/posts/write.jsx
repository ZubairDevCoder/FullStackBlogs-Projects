"use client";

import { db, storage } from "@/lib/firebase";
import { deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { deletePosts } from "@/lib/firebase/posts/write";
// 🔹 CREATE Posts
export const createNewPosts = async (data) => {
  if (!data.name) throw new Error("Name is required");
  if (!data.slug) throw new Error("Slug is required");
  if (!data.image) throw new Error("Image is required");

  const imageRef = ref(storage, `posts/${data.slug}`);
  await uploadBytes(imageRef, data.image);
  const imageUrl = await getDownloadURL(imageRef);

  const PostsRef = doc(db, "posts", data.slug);
  await setDoc(PostsRef, {
    name: data.name,
    slug: data.slug,
    iconURL: imageUrl,
    createdAt: Timestamp.now(),
  });

  return { name: data.name, slug: data.slug, iconURL: imageUrl };
};

// 🔹 DELETE Posts (Firestore + Storage)
export const deletePosts = async (cat) => {
  if (!cat?.id) throw new Error("Posts ID is required");

  // Delete Firestore doc
  await deleteDoc(doc(db, "posts", cat.id));

  // Delete Storage image
  if (cat.iconURL) {
    try {
      // Extract file path from full URL
      const path = decodeURIComponent(
        cat.iconURL.split("/o/")[1].split("?alt=media")[0],
      );
      const imageRef = ref(storage, path);
      await deleteObject(imageRef);
    } catch (err) {
      console.warn("Failed to delete image from storage:", err.message);
    }
  }
};
