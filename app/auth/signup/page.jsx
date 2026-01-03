"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        email: email.toLowerCase(),
        role: "patient",
        createdAt: new Date(),
      });

      // Set cookie for middleware (role-based protection)
      document.cookie = `userRole=patient; path=/; max-age=${60 * 60 * 24 * 365}`;

      // Save to localStorage for navbar
      localStorage.setItem("loginTime", Date.now().toString());
      localStorage.setItem("userName", name.trim());
      localStorage.setItem("userRole", "patient");

      // Redirect to main website
      router.push("/");
    } catch (err) {
      let message = "Failed to create account.";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered. Please log in instead.";
      } else if (err.code === "auth/weak-password") {
        message = "Password too weak (minimum 6 characters).";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-blue-100 text-lg">Join HealthCare today</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                <p className="font-medium">{error}</p>
                {error.includes("already registered") && (
                  <Link
                    href="/auth/login"
                    className="mt-3 inline-block text-purple-600 font-semibold hover:underline"
                  >
                    → Go to Login Page
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 text-black"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 text-black"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 text-black"
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-purple-600 font-semibold hover:text-purple-800 transition"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
}