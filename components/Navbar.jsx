"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

export default function DashboardNavbar() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const name = localStorage.getItem("userName") || currentUser.email.split("@")[0];
        setUserName(name);
      } else {
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    router.push("/auth/login");
  };

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">H</span>
          </div>
          <span className="text-2xl font-extrabold">HospitalApp</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <User className="w-6 h-6" />
                <span className="font-medium text-lg">Hi, {userName}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-lg font-semibold transition shadow-md"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-5 py-2.5 bg-white text-teal-600 hover:bg-gray-100 rounded-lg font-semibold transition shadow"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}