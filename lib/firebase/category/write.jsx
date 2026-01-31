"use client";

import { db, storage } from "@/lib/firebase";
import { deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// 🔹 CREATE CATEGORY
export const createNewCategory = async (data) => {
  if (!data.name) throw new Error("Name is required");
  if (!data.slug) throw new Error("Slug is required");
  if (!data.image) throw new Error("Image is required");

  const imageRef = ref(storage, `categories/${data.slug}`);
  await uploadBytes(imageRef, data.image);
  const imageUrl = await getDownloadURL(imageRef);

  const categoryRef = doc(db, "categories", data.slug);
  await setDoc(categoryRef, {
    name: data.name,
    slug: data.slug,
    iconURL: imageUrl,
    createdAt: Timestamp.now(),
  });

  return { name: data.name, slug: data.slug, iconURL: imageUrl };
};

// 🔹 DELETE CATEGORY (Firestore + Storage)
export const deleteCategory = async (cat) => {
  if (!cat?.id) throw new Error("Category ID is required");

  // Delete Firestore doc
  await deleteDoc(doc(db, "categories", cat.id));

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
