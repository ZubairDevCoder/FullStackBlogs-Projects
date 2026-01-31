"use client";

import { AuthorsFormContextProvider } from "./contexts/AuthorsFormContext";

export default function Layout({ children }) {
  return <AuthorsFormContextProvider>{children}</AuthorsFormContextProvider>;
}
