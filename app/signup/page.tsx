"use client";

import { auth, db, storage } from '@/lib/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aadharCard, setAadharCard] = useState<File | null>(null);
  const [studentId, setStudentId] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);
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

      // 1. Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      });

      await setDoc(doc(db, 'lendor', user.uid), {
        first_name: firstName,
        last_name: lastName,
        age: parseInt(age),
        occupation,
        country,
        state,
        city,
        full_address: fullAddress,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // 3. Handle file uploads to Firebase Storage
      if (aadharCard) {
        const aadharRef = ref(storage, `documents/${user.uid}/aadhar`);
        await uploadBytes(aadharRef, aadharCard);
      }

      if (studentId) {
        const studentIdRef = ref(storage, `documents/${user.uid}/student`);
        await uploadBytes(studentIdRef, studentId);
      }

      if (panCard) {
        const panCardRef = ref(storage, `documents/${user.uid}/pan`);
        await uploadBytes(panCardRef, panCard);
      }

      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="min-h-screen flex my-10 items-center justify-center">
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

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  type="text" 
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  type="text" 
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="Enter Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input 
                  id="occupation" 
                  type="text" 
                  placeholder="Enter Occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  type="text" 
                  placeholder="Enter Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  type="text" 
                  placeholder="Enter State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  type="text" 
                  placeholder="Enter City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullAddress">Full Address</Label>
                <Input 
                  id="fullAddress" 
                  type="text" 
                  placeholder="Enter Full Address"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  required
                />
              </div>
              <Button type="button" className="w-full" size="lg" onClick={handleNext}>
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Choose Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter Email"
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
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between">
                <Button type="button" className="w-1/2 mr-2" onClick={handleBack}>
                  Back
                </Button>
                <Button type="button" className="w-1/2 ml-2" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="aadharCard">Aadhar Card (Required)</Label>
                <Input 
                  id="aadharCard" 
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setAadharCard(e.target.files ? e.target.files[0] : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID (Optional)</Label>
                <Input 
                  id="studentId" 
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setStudentId(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panCard">PAN Card (Optional)</Label>
                <Input 
                  id="panCard" 
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setPanCard(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              <div className="flex justify-between">
                <Button type="button" className="w-1/2 mr-2" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit" className="w-1/2 ml-2">
                  Submit
                </Button>
              </div>
            </>
          )}
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