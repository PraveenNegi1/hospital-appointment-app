"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user;

      // Save user role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email.trim(),
        role: "user",
        createdAt: new Date().toISOString(),
      });

      // Success → redirect to login
      router.push("/auth/login");
    } catch (err) {
      let message = "Something went wrong. Please try again.";

      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email format.";
      } else if (err.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (err.code === "permission-denied") {
        message = "Permission denied. Contact support.";
      }

      setError(message);
      console.error("Signup error:", err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Create Account</h1>
            <p className="mt-3 text-green-100 text-base">
              Join our hospital appointment system today
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 outline-none placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 outline-none placeholder-gray-400"
                  placeholder="••••••••"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Minimum 6 characters
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-teal-600 hover:text-teal-800 font-medium transition-colors"
              >
                Sign in here
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}