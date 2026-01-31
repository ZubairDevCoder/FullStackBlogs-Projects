"use client";

import { AdminsFormContextProvider } from "./contexts/AdminsFormContext";

export default function Layout({ children }) {
  return <AdminsFormContextProvider>{children}</AdminsFormContextProvider>;
}
