"use client";

import { createContext, useContext } from "react";
import { useForm } from "react-hook-form";
import { db, storage } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const PostsFormContext = createContext(null);

export const PostsFormContextProvider = ({ children }) => {
  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      content: "",
      authorName: "",
      categoryName: "",
      image: null,
    },
  });

  const onSubmit = async (data, existingIconURL = null) => {
    let iconURL = existingIconURL;

    // ✅ IMAGE UPLOAD
    if (data.image?.[0]) {
      const file = data.image[0];
      const imgRef = ref(storage, `posts/${data.slug}`);
      await uploadBytes(imgRef, file);
      iconURL = await getDownloadURL(imgRef);
    }

    // ❌ remove FileList
    const payload = { ...data };
    delete payload.image;

    await setDoc(
      doc(db, "posts", payload.slug),
      {
        ...payload,
        iconURL,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  return (
    <PostsFormContext.Provider value={{ ...form, onSubmit }}>
      {children}
    </PostsFormContext.Provider>
  );
};

export const usePostsForm = () => {
  const ctx = useContext(PostsFormContext);
  if (!ctx) throw new Error("usePostsForm must be used inside provider");
  return ctx;
};
