"use client";

import { CategoriesFormContextProvider } from "./contexts/CategoriesFormContext";

export default function Layout({ children }) {
  return (
    <CategoriesFormContextProvider>{children}</CategoriesFormContextProvider>
  );
}
