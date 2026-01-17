// app/my-appointments/page.jsx

"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged-in Patient UID:", user.uid);
        const unsubscribeQuery = fetchUserAppointments(user.uid);
        return () => unsubscribeQuery();
      } else {
        setError("Please sign in to view your appointments");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchUserAppointments = (patientUid) => {
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", patientUid),

      orderBy("createdAt", "desc") // newest bookings first
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(
          `Patient UID: ${patientUid} | Loaded ${data.length} appointments`
        );

        setAppointments(data);
        setLoading(false);
      },
      (err) => {
        console.error("Appointments fetch error:", err);
        setError(err.message || "Failed to load your appointments");
        setLoading(false);
      }
    );

    return unsubscribe;
  };
  console.log("Appointments State:", appointments);

  const getStatusBadge = (status) => {
    const lower = (status || "pending").toLowerCase();
    let bg = "bg-gray-100 text-gray-800 border-gray-300";
    let text = lower.charAt(0).toUpperCase() + lower.slice(1);

    if (lower === "pending") {
      bg = "bg-yellow-100 text-yellow-800 border-yellow-300";
    } else if (lower === "confirmed") {
      bg = "bg-green-100 text-green-800 border-green-300";
    } else if (lower === "rejected" || lower === "cancelled") {
      bg = "bg-red-100 text-red-800 border-red-300";
    } else if (lower === "completed") {
      bg = "bg-blue-100 text-blue-800 border-blue-300";
    }

    return {
      className: `px-5 py-2 rounded-full text-base font-medium border ${bg}`,
      text,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button + Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                My Appointments
              </h1>
              <p className="mt-3 text-xl text-gray-600">
                View all your booked appointments and their current status
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mb-4"></div>
            <p className="text-xl text-gray-700">
              Loading your appointments...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 text-lg mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-medium transition shadow-md"
            >
              Refresh Page
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              No appointments booked yet
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              When you book an appointment with a doctor, it will appear here
              showing its status (Pending, Confirmed, Rejected, etc.).
            </p>
            <Link href="/doctors">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-medium transition shadow-md">
                Find a Doctor & Book Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appt) => {
              const statusInfo = getStatusBadge(appt.status);

              return (
                <div
                  key={appt.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <h3 className="text-2xl font-bold">
                          Dr. {appt.doctorName || "Doctor"}
                        </h3>
                        <p className="mt-2 text-indigo-100 text-lg">
                          {appt.specialty || "Specialist"} • {appt.date} at{" "}
                          {appt.time}
                        </p>
                      </div>
                      <span className={statusInfo.className}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4 text-gray-700">
                    <div>
                      <span className="font-semibold block mb-1">
                        Reason for Visit:
                      </span>
                      <p className="text-gray-600">{appt.reason || "—"}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Age / Gender:</span>
                        <br />
                        {appt.patientAge || "?"} yrs •{" "}
                        {appt.patientGender || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Phone:</span>
                        <br />
                        {appt.patientPhone || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Booked on:</span>
                        <br />
                        {appt.createdAt?.toDate
                          ? appt.createdAt.toDate().toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "—"}
                      </div>
                    </div>

                    {appt.patientAddress && (
                      <div>
                        <span className="font-semibold">Address:</span>
                        <br />
                        <p className="text-gray-600">{appt.patientAddress}</p>
                      </div>
                    )}
                  </div>

                  {/* Cancel button for pending appointments */}
                  {appt.status?.toLowerCase() === "pending" && (
                    <div className="p-6 pt-0 border-t bg-gray-50 flex gap-4">
                      <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition">
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
