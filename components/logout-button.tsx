"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('auth-token');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button onClick={handleLogout} variant="ghost">
      Logout
    </Button>
  );
}
