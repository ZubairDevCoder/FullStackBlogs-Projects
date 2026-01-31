"use client";

import { db, storage } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { createNewAdmins, deleteAdmins } from "@/lib/firebase/admins/write";
/* ================= CREATE ADMIN ================= */
export const createNewAdmins = async ({ name, email, image }) => {
  if (!name || !email || !image) {
    throw new Error("All fields required");
  }

  const adminId = email.toLowerCase();

  const imageRef = ref(storage, `admins/${adminId}`);
  await uploadBytes(imageRef, image);
  const iconURL = await getDownloadURL(imageRef);

  await setDoc(doc(db, "admins", adminId), {
    name,
    email: adminId,
    iconURL,
    createdAt: Timestamp.now(),
  });

  return { id: adminId };
};

/* ================= DELETE ADMIN ================= */
export const deleteAdmins = async ({ id, iconURL }) => {
  if (!id) throw new Error("Admin ID required");

  await deleteDoc(doc(db, "admins", id));

  if (iconURL) {
    const path = decodeURIComponent(iconURL.split("/o/")[1].split("?")[0]);
    await deleteObject(ref(storage, path));
  }
};
