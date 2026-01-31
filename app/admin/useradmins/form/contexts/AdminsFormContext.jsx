"use client";

import { createContext, useContext } from "react";
import { useForm } from "react-hook-form";

import { createNewAdmins } from "@/lib/firebase/Admins/write";

// ✅ Context ka alag naam
const AdminsFormContext = createContext(null);

export const AdminsFormContextProvider = ({ children }) => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      image: null,
    },
  });

  const onSubmit = async (data) => {
    await createNewAdmins(data);
  };

  return (
    <AdminsFormContext.Provider value={{ ...form, onSubmit }}>
      {children}
    </AdminsFormContext.Provider>
  );
};

// ✅ Correct hook
export const useAdminsForm = () => {
  const context = useContext(AdminsFormContext);

  if (!context) {
    throw new Error(
      "useAdminsForm must be used inside AdminsFormContextProvider",
    );
  }

  return context;
};
