import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const getAllCategory = async () => {
  const snaps = await getDocs(collection(db, "categories"));

  return snaps.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getCategoryById = async (id) => {
  if (!id) return null;
  const snap = await getDoc(doc(db, "categories", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};