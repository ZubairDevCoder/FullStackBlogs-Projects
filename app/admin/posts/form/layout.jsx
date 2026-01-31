"use client";

import { PostsFormContextProvider } from "./contexts/PostsFormContext";

export default function Layout({ children }) {
  return (
    <PostsFormContextProvider>{children}</PostsFormContextProvider>
  );
}
