// lib/firebase/category/read.js
"use client";

import { collection, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import { db } from "@/lib/firebase";
import { useAdmins } from "@/lib/firebase/admins/read";
export function useAdmins() {
  const { data, error } = useSWRSubscription(
    ["admins"],
    ([path], { next }) => {
      const ref = collection(db, path);
      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          next(
            null,
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })),
          );
        },
        (err) => next(err),
      );
      return () => unsub();
    },
  );

  return { data, error, isLoading: !data && !error };
}
