import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const getAllAdmin = async () => {
  const snaps = await getDocs(collection(db, "admins"));

  return snaps.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
