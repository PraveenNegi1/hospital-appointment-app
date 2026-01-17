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

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // default to today
  );

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeQuery = fetchDoctorAppointments(user.uid);
        return () => {
          unsubscribeQuery();
        };
      } else {
        setError("Please sign in as a doctor");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchDoctorAppointments = (doctorUid) => {
    setLoading(true);
    setError(null);

    let q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorUid),
      orderBy("createdAt", "desc")
    );

    // Apply date filter only if a date is selected
    if (selectedDate) {
      q = query(q, where("date", "==", selectedDate));
    }

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(`Loaded ${data.length} appointments for ${selectedDate || "all dates"}`);
        setAppointments(data);
        setLoading(false);
      },
      (err) => {
        console.error("Appointments query error:", err);
        setError(err.message || "Failed to load appointments");
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header + Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              My Appointments
            </h1>
            <p className="mt-3 text-xl text-gray-600">
              View and manage incoming patient bookings
            </p>
          </div>

          {/* Date Filter */}
          <div className="w-full md:w-auto min-w-[240px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Appointment Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mb-4"></div>
            <p className="text-xl text-gray-700">Loading appointments...</p>
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
              {selectedDate
                ? `No appointments scheduled for ${selectedDate}`
                : "No incoming appointments yet"}
            </h3>
            <p className="text-lg text-gray-600">
              {selectedDate
                ? "Try selecting a different date or check back later."
                : "When patients book with you, their requests will appear here in real-time."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {appt.patientName || "Patient"} • {appt.patientAge || "?"} yrs
                      </h3>
                      <p className="mt-2 text-indigo-100 text-lg">
                        {appt.date} at {appt.time}
                      </p>
                    </div>
                    <span
                      className={`px-5 py-2 rounded-full text-base font-medium ${
                        appt.status === "pending"
                          ? "bg-yellow-500 text-yellow-900"
                          : appt.status === "confirmed"
                          ? "bg-green-500 text-green-900"
                          : appt.status === "cancelled"
                          ? "bg-red-500 text-red-900"
                          : "bg-gray-500 text-gray-900"
                      }`}
                    >
                      {appt.status
                        ? appt.status.charAt(0).toUpperCase() + appt.status.slice(1)
                        : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4 text-gray-700">
                  <div>
                    <span className="font-semibold block mb-1">Reason for Visit:</span>
                    <p className="text-gray-600">{appt.reason || "—"}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Phone:</span> {appt.patientPhone || "—"}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span>{" "}
                      {appt.patientEmail || "—"}
                    </div>
                    <div>
                      <span className="font-semibold">Gender:</span>{" "}
                      {appt.patientGender || "—"}
                    </div>
                    <div>
                      <span className="font-semibold">Booked on:</span>{" "}
                      {appt.createdAt?.toDate
                        ? appt.createdAt.toDate().toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Actions (add logic later) */}
                {appt.status === "pending" && (
                  <div className="p-6 pt-0 border-t bg-gray-50 flex gap-4 flex-wrap">
                    <button className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition">
                      Confirm Appointment
                    </button>
                    <button className="flex-1 min-w-[140px] bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition">
                      Cancel / Reject
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