"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, HeartPulse, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";

export default function MainNavbar() {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/auth/login");
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <nav className="sticky top-0 z-50 font-serif bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="w-8 h-8 text-indigo-600" />
          <span className="text-2xl font-extrabold text-gray-900">
            Health<span className="text-indigo-600">Care</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/about"
            className="text-gray-700 font-medium hover:text-indigo-600 transition"
          >
            About
          </Link>
          <Link
            href="/doctors"
            className="text-gray-700 font-medium hover:text-indigo-600 transition"
          >
            Doctors
          </Link>
          <Link
            href="/my-appointments"
            className="text-gray-700 font-medium hover:text-indigo-600 transition"
          >
            My-Appointments
          </Link>

          {loading ? (
            <div className="w-40 h-10 bg-gray-200 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-indigo-600" />
                <span className="font-semibold text-gray-800">
                  Hi, {displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signup"
              className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition shadow-md"
            >
              Sign Up
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="flex flex-col gap-6 px-6 py-8">
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="text-gray-700 font-medium text-lg hover:text-indigo-600 transition"
            >
              About
            </Link>
            <Link
              href="/doctors"
              onClick={() => setOpen(false)}
              className="text-gray-700 font-medium text-lg hover:text-indigo-600 transition"
            >
              Doctors
            </Link>
            <Link
              href="/my-appointments"
              onClick={() => setOpen(false)}
              className="text-gray-700 font-medium text-lg hover:text-indigo-600 transition"
            >
              My-Appointments
            </Link>

            {user ? (
              <>
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600 mb-1">Signed in as</p>
                  <p className="font-bold text-gray-900 text-lg">
                    {displayName}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-3 py-4 px-6 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/signup"
                onClick={() => setOpen(false)}
                className="block text-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
