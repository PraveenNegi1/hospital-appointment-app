// app/auth/doctor-signup/page.jsx
"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // ← adjust path to your firebase config
import { useRouter } from "next/navigation";

export default function DoctorSignup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      // 2. Save role in users collection
      await setDoc(doc(db, "users", user.uid), {
        email: email.trim(),
        fullName: fullName.trim(),
        role: "doctor",
        createdAt: new Date().toISOString(),
      });

      // 3. Save doctor profile in doctors collection
      await setDoc(doc(db, "doctors", user.uid), {
        uid: user.uid,
        fullName: fullName.trim(),
        email: email.trim(),
        specialty: specialty.trim(),
        status: "pending", // you can change to "approved" if you auto-approve
        createdAt: new Date().toISOString(),
      });

      // Success → redirect to doctor dashboard
      router.push("/dashboard/doctor");
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
      console.error("Doctor signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Doctor Registration
            </h1>
            <p className="mt-3 text-indigo-100">
              Join our platform and manage your appointments
            </p>
          </div>

          {/* Form */}
          <div className="p-6 md:p-10">
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Dr. John Smith"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="doctor@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 6 characters
                </p>
              </div>

              {/* Specialty */}
              <div>
                <label
                  htmlFor="specialty"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Specialty / Profession
                </label>
                <input
                  id="specialty"
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Cardiology, Pediatrics, General Medicine..."
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-6 rounded-xl text-white font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
                }`}
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
                    Creating profile...
                  </>
                ) : (
                  "Register as Doctor"
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
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