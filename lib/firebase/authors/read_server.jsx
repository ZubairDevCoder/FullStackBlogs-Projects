import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const getAllAuthors = async () => {
  const snaps = await getDocs(collection(db, "authors"));

  return snaps.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
