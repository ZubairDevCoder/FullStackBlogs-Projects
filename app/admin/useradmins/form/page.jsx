"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminsForm } from "./contexts/AdminsFormContext";
import { toast } from "sonner";

import { db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ================= FORM =================
function AdminsFormContent({ adminEmail }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useAdminsForm();

  const [preview, setPreview] = useState(null);

  /* ================= LOAD (EDIT) ================= */
  useEffect(() => {
    if (!adminEmail) return;

    const loadAdmin = async () => {
      const snap = await getDoc(doc(db, "admins", adminEmail));
      if (!snap.exists()) {
        toast.error("Admin not found");
        return;
      }

      const data = snap.data();
      reset({
        name: data.name,
        email: data.email,
        image: null,
      });
      setPreview(data.iconURL);
    };

    loadAdmin();
  }, [adminEmail, reset]);

  /* ================= IMAGE PREVIEW ================= */
  const imageFile = watch("image");
  useEffect(() => {
    if (!imageFile?.[0]) return;
    const url = URL.createObjectURL(imageFile[0]);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  /* ================= SUBMIT ================= */
  const submitHandler = async (data) => {
    try {
      const emailId = data.email.toLowerCase();
      let iconURL = preview;

      if (data.image?.[0]) {
        const imageRef = ref(storage, `admins/${emailId}`);
        await uploadBytes(imageRef, data.image[0]);
        iconURL = await getDownloadURL(imageRef);
      }

      await setDoc(
        doc(db, "admins", emailId),
        {
          name: data.name,
          email: emailId,
          iconURL,
          updatedAt: serverTimestamp(),
          createdAt: adminEmail ? undefined : serverTimestamp(),
        },
        { merge: true },
      );

      toast.success(adminEmail ? "Admin updated" : "Admin created");
      router.push("/admin/useradmins");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <Card className="max-w-lg mx-auto my-6">
      <CardHeader>
        <CardTitle>{adminEmail ? "Edit Admin" : "Create Admin"}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              placeholder="Enter full name"
              {...register("name", { required: "Name required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="admin@example.com"
              disabled={!!adminEmail}
              {...register("email", { required: "Email required" })}
            />
          </div>

          <div>
            <Label>Image</Label>
            <Input type="file" {...register("image")} />
            {preview && (
              <img
                src={preview}
                className="w-28 h-28 mt-2 rounded object-cover"
              />
            )}
          </div>

          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : adminEmail
                ? "Update Admin"
                : "Create Admin"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ================= PAGE =================
export default function Page({ searchParams }) {
  const adminEmail = searchParams?.id || null; // ✅ use props instead of useSearchParams
  return <AdminsFormContent adminEmail={adminEmail} />;
}
