// app/doctor/appointments/page.jsx  (your doctor dashboard)

"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeQuery = fetchDoctorAppointments(user.uid);
        return () => unsubscribeQuery();
      } else {
        setError("Please sign in as a doctor to view appointments");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchDoctorAppointments = (doctorUid) => {
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorUid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Failed to load appointments");
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  // NEW: Function to confirm or reject appointment
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    if (!confirm(`Are you sure you want to ${newStatus === "confirmed" ? "confirm" : "reject"} this appointment?`)) {
      return;
    }

    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: auth.currentUser?.uid || "doctor", // optional
      });

      alert(`Appointment ${newStatus === "confirmed" ? "confirmed" : "rejected"} successfully!`);
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status. Check permissions or network.");
    }
  };

  return (
    <div className="min-h-screen font-serif bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 sm:px-6 lg:px-10 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="flex items-start gap-4">
            <Link href="/dashboard/doctor">
              <button className="rounded-xl bg-white/80 backdrop-blur border border-gray-200 px-5 py-3 text-gray-800 font-medium shadow hover:shadow-lg hover:bg-white transition">
                ← Dashboard
              </button>
            </Link>

            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                My Appointments
              </h1>
              <p className="mt-3 text-lg md:text-xl text-gray-600">
                Manage all patient bookings in one place
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="h-16 w-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mb-6" />
            <p className="text-lg font-medium text-gray-700">
              Fetching appointments…
            </p>
          </div>
        ) : error ? (
          /* Error */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-10 text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Oops!</h2>
            <p className="text-gray-700 text-lg mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-semibold transition shadow-lg"
            >
              Reload Page
            </button>
          </div>
        ) : appointments.length === 0 ? (
          /* Empty State */
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-14 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              No Appointments Yet
            </h3>
            <p className="text-lg text-gray-600">
              New patient bookings will appear here instantly.
            </p>
          </div>
        ) : (
          /* Appointments */
          <div className="grid gap-8">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Top */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {appt.patientName || "Patient"}{" "}
                        <span className="text-indigo-200 font-medium">
                          • {appt.patientAge || "?"} yrs
                        </span>
                      </h3>
                      <p className="mt-2 text-indigo-100 text-lg">
                        {appt.date} • {appt.time}
                      </p>
                    </div>

                    <span
                      className={`self-start px-5 py-2 rounded-full text-sm font-semibold tracking-wide ${
                        appt.status === "pending"
                          ? "bg-yellow-400 text-yellow-900"
                          : appt.status === "confirmed"
                          ? "bg-green-400 text-green-900"
                          : appt.status === "cancelled"
                          ? "bg-red-400 text-red-900"
                          : "bg-gray-400 text-gray-900"
                      }`}
                    >
                      {appt.status
                        ? appt.status.charAt(0).toUpperCase() +
                          appt.status.slice(1)
                        : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-6 text-gray-700">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Reason for Visit
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {appt.reason || "—"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {appt.patientPhone || "—"}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {appt.patientEmail || "—"}
                    </p>
                    <p>
                      <span className="font-semibold">Gender:</span>{" "}
                      {appt.patientGender || "—"}
                    </p>
                    <p>
                      <span className="font-semibold">Booked:</span>{" "}
                      {appt.createdAt?.toDate
                        ? appt.createdAt.toDate().toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Actions - Confirm / Reject buttons */}
                {appt.status === "pending" && (
                  <div className="bg-gray-50 border-t p-6 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, "confirmed")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition shadow"
                    >
                      ✔ Confirm
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, "rejected")}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition shadow"
                    >
                      ✖ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}