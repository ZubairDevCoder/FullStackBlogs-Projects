import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

// Fetch all posts
export const getAllPosts = async () => {
  const snaps = await getDocs(collection(db, "posts"));
  return snaps.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
// with category
export const getAllPostswithCategory = async (categoryId) => {
  const q = query(
    collection(db, "posts"),
    where("categoryId", "==", categoryId),
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Fetch single post by ID
export const getPostById = async (id) => {
  if (!id) return null;
  const snap = await getDoc(doc(db, "posts", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};
