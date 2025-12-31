"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import DashboardNavbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        setRole(userRole);

        // Redirect based on current path
        const path = window.location.pathname;
        if (path.includes("/patient") && userRole !== "patient")
          router.push("/dashboard");
        if (path.includes("/doctor") && userRole !== "doctor")
          router.push("/dashboard");
        if (path.includes("/admin") && userRole !== "admin")
          router.push("/dashboard");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="w-full bg-white p-6">
      <DashboardNavbar />

      {children}
    </div>
  );
}
