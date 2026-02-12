"use client";

import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";

export default function DoctorSidebar() {
  const { user, logout } = useAuth();
  const [newAppointmentsCount, setNewAppointmentsCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", user.uid),
      where("status", "==", "pending"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNewAppointmentsCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:block">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-10">
          Doctor Panel
        </h2>

        <nav className="space-y-2">
          <Link
            href="/dashboard/doctor"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 text-gray-700 font-medium transition"
          >
            <span className="w-6 h-6">🏠</span>
            Dashboard
          </Link>

          <Link
            href="/dashboard/doctor/appointments"
            className="relative flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 text-gray-700 font-medium transition"
          >
            <span className="w-6 h-6">📅</span>
            Appointments
            {newAppointmentsCount > 0 && (
              <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {newAppointmentsCount}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard/doctor/edit-profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 text-gray-700 font-medium transition"
          >
            <span className="w-6 h-6">👤</span>
            Profile
          </Link>
        </nav>
      </div>
    </aside>
  );
}
