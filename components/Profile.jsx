"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { signOut, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogCloseRef = useRef();
const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        setName(u.displayName || "");
        setPreview(u.photoURL || null);
      }
    });
    return () => unsub();
  }, []);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      let photoURL = preview;

      // Upload image to Firebase Storage if new file selected
      if (file) {
        const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Firebase Auth
      await updateProfile(user, { displayName: name, photoURL });

      // Update Firestore
      await setDoc(
        doc(db, "users", user.uid),
        { displayName: name, photoURL, updatedAt: serverTimestamp() },
        { merge: true },
      );

      toast.success("Profile updated successfully");

      // ✅ Close dialog automatically
      if (dialogCloseRef.current) dialogCloseRef.current.click();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");

      // 👇 redirect to home
      router.replace("/");
    } catch {
      toast.error("Logout failed");
    }
  };


  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-9 h-9 cursor-pointer">
          {preview ? (
            <AvatarImage src={preview} />
          ) : (
            <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 px-2 pb-4">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{user.displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        {/* Edit Profile */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="w-full justify-start">
              Edit Profile
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateProfile();
              }}
            >
              <div className="space-y-4">
                <Avatar className="w-20 h-20 mx-auto">
                  {preview ? (
                    <AvatarImage src={preview} />
                  ) : (
                    <AvatarFallback>{name?.[0] || "U"}</AvatarFallback>
                  )}
                </Avatar>

                <div className="space-y-3">
                  <label htmlFor="profileImage" className="text-sm font-medium">
                    Profile Image
                  </label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1.5"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                {/* Hidden button to close dialog automatically */}
                <DialogClose ref={dialogCloseRef} className="hidden" />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <DropdownMenuSeparator />

        {/* Logout */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full justify-start">
              Logout
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Logout
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
