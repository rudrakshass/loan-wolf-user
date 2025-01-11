"use client";

import { supabase } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validateStep1 = () => {
    if (!firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!age || parseInt(age) < 18) {
      setError("You must be at least 18 years old");
      return false;
    }
    if (!occupation.trim()) {
      setError("Occupation is required");
      return false;
    }
    if (!country.trim() || !state.trim() || !city.trim()) {
      setError("Location details are required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Valid email is required");
      return false;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");  // Clear any existing errors
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // 1. First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Then insert the additional user data
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              first_name: firstName,
              last_name: lastName,
              age: parseInt(age),
              occupation,
              country,
              state,
              city,
              username,
              email,
            }
          ]);

        if (profileError) throw profileError;

        // 3. Handle file uploads if needed
        if (aadharCard) {
          const { error: aadharError } = await supabase.storage
            .from('documents')
            .upload(`${authData.user.id}/aadhar`, aadharCard);
          if (aadharError) throw aadharError;
        }

        // Optional document uploads
        if (studentId) {
          await supabase.storage
            .from('documents')
            .upload(`${authData.user.id}/student`, studentId);
        }

        if (panCard) {
          await supabase.storage
            .from('documents')
            .upload(`${authData.user.id}/pan`, panCard);
        }

        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg border"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">
            Enter your credentials to create an account
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">First Name</Label>
            <Input 
              id="username" 
              type="text" 
              placeholder="Enter First Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Last Name</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter Last Name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Sign Up
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            type="button"
            variant="outline" 
            // onClick={signupWithGoogle}
          >
            Google
          </Button>
          <Button 
            type="button"
            variant="outline"
            // onClick={signupWithGitHub}
          >
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm">
          Have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}