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
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);

  const signupForm = useForm();
  const signinForm = useForm();

  const router = useRouter();
  const togglePassword = () => setShowPassword((prev) => !prev);

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
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
        onClick={togglePassword}
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
        onClick={() => onClick(googleProvider)}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
      >
        <img src="/google.png" alt="google" width={20} /> Continue with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => onClick(facebookProvider)}
        className="w-full flex items-center justify-center gap-2   "
      >
        <img src="/facebook.png" alt="google" width={20} /> Continue with
        Facebook
      </Button>
    </div>
  );

  const handleSignin = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Signin Successful! Welcome back.");
      signinForm.reset();
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSignup = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      await updateProfile(userCredential.user, { displayName: data.fullName });
      toast.success(`Signup Successful! Welcome, ${data.fullName}`);
      signupForm.reset();
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Login Successful!");
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleForgotPassword = async (email) => {
    if (!email) return toast.error("Please enter your email first");
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md">
        {/* ==== TOP TEXT HOOK ==== */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold">
            Build. Launch. Scale Your SaaS 🚀
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            AI SaaS · Dev Tool · Agency · Blog Platform
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* ================= SIGN IN ================= */}
          <TabsContent value="signin">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-center">Welcome Back 👋</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={signinForm.handleSubmit(handleSignin)}
                  className="space-y-3"
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
                  <Button type="submit" className="w-full mt-2">
                    {signinForm.formState.isSubmitting
                      ? "Signing in..."
                      : "Sign In"}
                  </Button>
                  <div className="text-center text-sm mt-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleForgotPassword(signinForm.getValues("email"))
                      }
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <SocialButtons onClick={handleSocialLogin} />
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= SIGN UP ================= */}
          <TabsContent value="signup">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-center">
                  Create Free Account ✨
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={signupForm.handleSubmit(handleSignup)}
                  className="space-y-3"
                >
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Full Name"
                    {...signupForm.register("fullName", {
                      required: "Full Name is required",
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

                  <Button type="submit" className="w-full mt-2">
                    {signupForm.formState.isSubmitting
                      ? "Creating..."
                      : "Sign Up"}
                  </Button>
                  <div className="text-center text-sm mt-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleForgotPassword(signinForm.getValues("email"))
                      }
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Forgot Password?
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
