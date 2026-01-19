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
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";

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
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(
          `Patient UID: ${patientUid} | Loaded ${data.length} appointments`,
        );
        setAppointments(data);
        setLoading(false);
      },
      (err) => {
        console.error("Appointments fetch error:", err);
        setError(err.message || "Failed to load your appointments");
        setLoading(false);
      },
    );

    return unsubscribe;
  };

  const getStatusBadge = (status) => {
    const lower = (status || "pending").toLowerCase();
    let styles = {
      pending: "bg-amber-100 text-amber-800 border-amber-300",
      confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
      rejected: "bg-rose-100 text-rose-800 border-rose-300",
      cancelled: "bg-rose-100 text-rose-800 border-rose-300",
      completed: "bg-sky-100 text-sky-800 border-sky-300",
    };

    const chosen = styles[lower] || "bg-gray-100 text-gray-700 border-gray-300";

    return {
      className: `inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border ${chosen} shadow-sm`,
      text: lower.charAt(0).toUpperCase() + lower.slice(1),
    };
  };

  return (
    <div className="min-h-screen font-serif bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 pb-16 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h1 className="text-3xl  font-bold text-gray-900 tracking-tight">
                My Appointments
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-gray-600">
                Track and manage all your booked consultations
              </p>
            </div>

            <Link
              href="/doctors"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              Book New Appointment
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
              <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
            </div>
            <p className="mt-6 text-lg font-medium text-gray-700">
              Loading your appointments...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-2xl mx-auto border border-red-100">
            <AlertCircle className="mx-auto h-14 w-14 text-red-500 mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-600 text-lg mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && appointments.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 text-center max-w-3xl mx-auto border border-gray-100">
            <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <CalendarDays className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              No appointments yet
            </h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Start by finding a doctor and booking your first consultation — it
              will appear here.
            </p>
            <Link href="/doctors">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
                Find a Doctor Now
              </button>
            </Link>
          </div>
        )}

        {/* Appointment Cards */}
        {!loading && !error && appointments.length > 0 && (
          <div className="grid gap-6 md:gap-8">
            {appointments.map((appt) => {
              const statusInfo = getStatusBadge(appt.status);

              return (
                <div
                  key={appt.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100/80 overflow-hidden transition-all duration-300 group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 px-6 py-7 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                          Dr. {appt.doctorName || "Doctor"}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-indigo-100 text-sm sm:text-base">
                          <span>{appt.specialty || "Specialist"}</span>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4" />
                            <span>{appt.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{appt.time}</span>
                          </div>
                        </div>
                      </div>

                      <span className={statusInfo.className}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 space-y-6 text-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm sm:text-base">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-800">
                            Patient
                          </div>
                          <div>
                            {appt.patientAge || "?"} yrs •{" "}
                            {appt.patientGender || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-800">
                            Phone
                          </div>
                          <div>{appt.patientPhone || "—"}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CalendarDays className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-800">
                            Booked
                          </div>
                          <div>
                            {appt.createdAt?.toDate
                              ? appt.createdAt
                                  .toDate()
                                  .toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span>Reason for Visit</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {appt.reason || "Not specified"}
                      </p>
                    </div>

                    {appt.patientAddress && (
                      <div className="pt-2">
                        <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-indigo-600" />
                          <span>Address</span>
                        </div>
                        <p className="text-gray-600">{appt.patientAddress}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {appt.status?.toLowerCase() === "pending" && (
                    <div className="px-6 py-5 bg-gray-50/70 border-t flex gap-4">
                      <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]">
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
