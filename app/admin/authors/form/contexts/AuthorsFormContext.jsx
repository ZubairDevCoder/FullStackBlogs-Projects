"use client";

import { createContext, useContext } from "react";
import { useForm } from "react-hook-form";

import { createNewAuthors } from "@/lib/firebase/authors/write";

// ✅ Context ka alag naam
const AuthorsFormContext = createContext(null);

export const AuthorsFormContextProvider = ({ children }) => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      image: null,
    },
  });

  const onSubmit = async (data) => {
    await createNewAuthors(data);
  };

  return (
    <AuthorsFormContext.Provider value={{ ...form, onSubmit }}>
      {children}
    </AuthorsFormContext.Provider>
  );
};

// ✅ Correct hook
export const useAuthorsForm = () => {
  const context = useContext(AuthorsFormContext);

  if (!context) {
    throw new Error(
      "useAuthorsForm must be used inside AuthorsFormContextProvider",
    );
  }

  return context;
};
