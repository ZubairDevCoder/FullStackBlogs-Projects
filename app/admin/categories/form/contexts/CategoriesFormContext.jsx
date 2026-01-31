"use client";

import { createContext, useContext } from "react";
import { useForm } from "react-hook-form";
import { createNewCategory } from "@/lib/firebase/category/write";

const CategoryFormContext = createContext(null);

export const CategoriesFormContextProvider = ({ children }) => {
  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      image: null,
    },
  });

  const onSubmit = async (data) => {
    await createNewCategory(data);
  };

  return (
    <CategoryFormContext.Provider value={{ ...form, onSubmit }}>
      {children}
    </CategoryFormContext.Provider>
  );
};

export const useCategoryForm = () => {
  const context = useContext(CategoryFormContext);
  if (!context) {
    throw new Error(
      "useCategoryForm must be used inside CategoriesFormContextProvider",
    );
  }
  return context;
};
