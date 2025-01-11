"use client";

import { auth, db } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (user) {
        const userDoc = await getDoc(doc(db, selectedRole , user.uid));
        const userData = userDoc.data();
        
        if (userData) {
          router.push(`/${selectedRole}`);
        } else {
          setError('User not found in selected role');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login');
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg border">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className='relative'
          >
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold">Welcome to LoanWolf</h1>
              <p className="text-muted-foreground">How would you like to login?</p>
              
              <div className="flex flex-col gap-4 mt-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => setSelectedRole('lender')}
                    className="w-full h-16 text-lg"
                  >
                    Continue as Lender
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => setSelectedRole('borrower')}
                    className="w-full h-16 text-lg"
                  >
                    Continue as Borrower
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex my-10 items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg border">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className='relative'
        >
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login as {selectedRole}</h1>
            <Button 
              variant="link"
              onClick={() => setSelectedRole(null)}
              className="text-sm text-primary"
            >
              Change role
            </Button>
          </div>

          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='relative'
                >
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border border-gray-300"
                required
              />
              </motion.div>
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='relative'
              >
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border border-gray-300"
                  required
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
              </motion.div>
              <br />
            <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="w-full" size="lg">
                Log In
              </Button>
            </motion.div>
            </div>
          </form>

          <div className="text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              <br />
              Forgot your password?
            </Link>
          </div>
          <br />
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}