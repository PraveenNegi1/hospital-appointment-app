"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setError("User profile not found. Contact admin.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const role = userData.role || "patient";

      // Set cookie for middleware
      document.cookie = `userRole=${role}; path=/; max-age=${60 * 60 * 24 * 365}`;

      // Save to localStorage for navbar
      localStorage.setItem("loginTime", Date.now().toString());
      localStorage.setItem("userName", userData.name || "User");
      localStorage.setItem("userRole", role);

      // Role-based redirection
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "doctor") {
        router.push("/dashboard/doctor");
      } else {
        router.push("/"); // Patient → main website
      }
    } catch (err) {
      let message = "Invalid email or password.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        message = "Incorrect email or password.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many attempts. Try again later.";
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
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-100 text-lg">Sign in to continue</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 text-black"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition shadow-lg disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-purple-600 font-semibold hover:text-purple-800 transition"
                >
                  Sign up
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