"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Shadcn UI Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);

  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const signinForm = useForm();
  const signupForm = useForm();
  const router = useRouter();

  const togglePassword = () => setShowPassword((p) => !p);

  /* ================= COMMON UI ================= */
  const ErrorLabel = ({ message }) => (
    <p className="text-red-500 text-sm">{message}</p>
  );

  const PasswordInput = (registerObj, errorObj) => (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        {...registerObj}
      />
      <span
        onClick={togglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
      {errorObj && <ErrorLabel message={errorObj.message} />}
    </div>
  );

  const SocialButtons = ({ onClick }) => (
    <div className="space-y-3 mt-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onClick(googleProvider)}
      >
        <img src="/google.png" alt="google" width={20} /> Continue with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onClick(facebookProvider)}
      >
        <img src="/facebook.png" alt="google" width={20} /> Continue with
        Facebook
      </Button>
    </div>
  );

  /* ================= HANDLERS ================= */
  const handleSignin = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Signin successful 🎉");
      signinForm.reset();
      router.push("/");
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  const handleSignup = async (data) => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      await updateProfile(res.user, {
        displayName: data.fullName,
      });

      toast.success(`Welcome ${data.fullName} 🚀`);
      signupForm.reset();
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Login successful 🎉");
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email first");
      return;
    }

    try {
      setIsResetSubmitting(true);
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Password reset email sent! 📩");
      setResetEmail("");
      setDialogOpen(false);
    } catch (err) {
      toast.error("Unable to send reset email");
    } finally {
      setIsResetSubmitting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Top Text */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold">Build. Launch. Scale 🚀</h1>
          <p className="text-muted-foreground mt-2">
            AI SaaS · Blog · Admin Panel
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* ================= SIGN IN ================= */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Welcome Back 👋</CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-2">
                <form
                  onSubmit={signinForm.handleSubmit(handleSignin)}
                  className="space-y-1.5"
                >
                  <Label>Email</Label>
                  <Input
                    placeholder="Email"
                    {...signinForm.register("email", {
                      required: "Email is required",
                    })}
                  />
                  {signinForm.formState.errors.email && (
                    <ErrorLabel
                      message={signinForm.formState.errors.email.message}
                    />
                  )}

                  <Label>Password</Label>
                  {PasswordInput(
                    signinForm.register("password", {
                      required: "Password is required",
                    }),
                    signinForm.formState.errors.password,
                  )}

                  <Button type="submit" className="w-full my-2">
                    {signinForm.formState.isSubmitting
                      ? "Signing in..."
                      : "Sign In"}
                  </Button>

                  <div className="text-center text-sm flex justify-between mt-1">
                    {/* Forgot Password Dialog */}
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <p className="text-blue-600 hover:underline text-center cursor-pointer w-full ">
                          Forgot Password?
                        </p>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Password Reset</DialogTitle>
                          <DialogDescription>
                            Enter your email and we’ll send you a reset link.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-2 space-y-2">
                          <Input
                            placeholder="Email"
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                          />
                          <Button
                            className="w-full"
                            onClick={handlePasswordReset}
                            disabled={isResetSubmitting}
                          >
                            {isResetSubmitting
                              ? "Sending..."
                              : "Send Reset Email"}
                          </Button>
                          <Button
                            className="w-full"
                            variant="ghost"
                            onClick={() => setDialogOpen(false)}
                            disabled={isResetSubmitting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <SocialButtons onClick={handleSocialLogin} />
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= SIGN UP ================= */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Create Account ✨</CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-2">
                <form
                  onSubmit={signupForm.handleSubmit(handleSignup)}
                  className="space-y-1.5"
                >
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Full Name"
                    {...signupForm.register("fullName", {
                      required: "Full name is required",
                    })}
                  />

                  <Label>Email</Label>
                  <Input
                    placeholder="Email"
                    {...signupForm.register("email", {
                      required: "Email is required",
                    })}
                  />

                  <Label>Password</Label>
                  {PasswordInput(
                    signupForm.register("password", {
                      required: "Password is required",
                    }),
                    signupForm.formState.errors.password,
                  )}

                  <Button type="submit" className="w-full my-2">
                    {signupForm.formState.isSubmitting
                      ? "Creating..."
                      : "Sign Up"}
                  </Button>

                  <div className="text-center text-sm mt-2">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => setActiveTab("signin")}
                    >
                      Sign In
                    </button>
                  </div>

                  <SocialButtons onClick={handleSocialLogin} />
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
