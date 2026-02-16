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
  Timestamp,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function DoctorAppointmentsDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Doctor logged in → UID:", user.uid);
        const unsubscribeQuery = fetchAppointments(user.uid);
        return () => unsubscribeQuery();
      } else {
        setError("Please sign in as a doctor to view appointments");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchAppointments = (doctorUid) => {
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorUid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(`Loaded ${data.length} appointment(s)`);
        setAppointments(data);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Failed to load appointments. Please try again.");
        setLoading(false);
      }
    );
  };

  const updateStatus = async (id, newStatus, sendNotification = false) => {
    if (!confirm(`Are you sure you want to mark this appointment as ${newStatus}?`)) {
      return;
    }

    try {
      const appointmentRef = doc(db, "appointments", id);
      const apptSnap = await getDoc(appointmentRef);

      if (!apptSnap.exists()) {
        alert("Appointment not found");
        return;
      }

      const apptData = apptSnap.data();

      await updateDoc(appointmentRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
        updatedBy: auth.currentUser?.uid || "system",
      });

      if (sendNotification && apptData.patientId) {
        let message = "";
        let type = "";

        if (newStatus.toLowerCase() === "confirmed") {
          type = "appointment_confirmed";
          message = `Your appointment has been CONFIRMED!\n\nDoctor: ${apptData.doctorName || "Your Doctor"}\nDate: ${formatDate(apptData.date)}\nTime: ${formatTime(apptData.time)}`;
        } else if (newStatus.toLowerCase() === "completed") {
          type = "appointment_completed";
          message = `Your check-up with ${apptData.doctorName || "Doctor"} is COMPLETED.\nThank you for visiting!\n\nDate: ${formatDate(apptData.date)}\nTime: ${formatTime(apptData.time)}\n\nTake care of your health.`;
        }

        if (message) {
          await addDoc(collection(db, "notifications"), {
            userId: apptData.patientId,
            type,
            appointmentId: id,
            doctorName: apptData.doctorName || "Doctor",
            patientName: apptData.patientName || "Patient",
            date: formatDate(apptData.date),
            time: formatTime(apptData.time),
            message,
            createdAt: Timestamp.now(),
            isRead: false,
          });
          console.log(`Notification sent for ${newStatus}:`, apptData.patientId);
        }
      }

      alert(`Appointment marked as ${newStatus}!`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update appointment status\n" + err.message);
    }
  };

  // ─────────────── Formatters ───────────────
  const formatDate = (value) => {
    if (!value) return "—";
    const date = value?.toDate ? value.toDate() : new Date(value);
    return isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  const formatTime = (value) => value || "—";

  const formatBooked = (ts) => {
    if (!ts?.toDate) return "—";
    return ts.toDate().toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusStyle = (status) => {
    const lower = (status || "pending").toLowerCase();
    switch (lower) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200 line-through";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200 font-medium";
      case "pending":
      default:
        return "bg-amber-100 text-amber-800 border-amber-200 animate-pulse-slow";
    }
  };

  const getStatusAction = (status) => {
    const lower = (status || "pending").toLowerCase();
    switch (lower) {
      case "pending":
        return "pending";
      case "confirmed":
        return "confirmed";
      case "completed":
        return "completed";
      case "rejected":
        return "rejected";
      case "cancelled":
        return "cancelled";
      default:
        return "unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <ArrowPathIcon className="h-12 w-12 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen font-serif bg-gray-50/50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-rose-600 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-serif bg-linear-to-br from-gray-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Appointments
            </h1>
            <p className="mt-2 text-gray-600">
              All your appointments • {appointments.length} total
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/doctor"
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition shadow-sm"
            >
              ← Dashboard
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-md flex items-center gap-2"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Refresh
            </button>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <CalendarDaysIcon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No appointments yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              When patients book with you, their appointments will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8">
            {appointments.map((appt) => {
              const statusAction = getStatusAction(appt.status);

              return (
                <div
                  key={appt.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="px-6 py-5 bg-linear-to-r from-indigo-600/95 to-indigo-700/95 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <h3 className="text-xl sm:text-2xl font-semibold">
                        {appt.patientName || "Patient"}{" "}
                        <span className="text-indigo-200 font-normal">
                          • {appt.patientAge || "?"} yrs
                        </span>
                      </h3>

                      <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-indigo-100/90 text-sm">
                        <div className="flex items-center gap-1.5">
                          <CalendarDaysIcon className="h-4.5 w-4.5" />
                          {formatDate(appt.date)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ClockIcon className="h-4.5 w-4.5" />
                          {formatTime(appt.time)}
                        </div>
                        {appt.patientLocation && (
                          <div className="flex items-center gap-1.5">
                            <MapPinIcon className="h-4.5 w-4.5" />
                            {appt.patientLocation}
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className={`px-5 py-1.5 rounded-full text-sm font-medium border ${getStatusStyle(
                        appt.status
                      )}`}
                    >
                      {appt.status
                        ? appt.status.charAt(0).toUpperCase() + appt.status.slice(1)
                        : "Pending"}
                    </div>
                  </div>

                  <div className="p-6 lg:p-7 grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1.5">
                        Reason for visit
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {appt.reason || "General check-up / consultation"}
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="h-5 w-5 text-gray-500 shrink-0" />
                        <span className="text-gray-800">{appt.patientPhone || "—"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-500 shrink-0" />
                        <span className="text-gray-800 break-all">{appt.patientEmail || "—"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5 text-gray-500 shrink-0" />
                        <span className="text-gray-800">{appt.patientGender || "—"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ClockIcon className="h-5 w-5 text-gray-500 shrink-0" />
                        <span className="text-gray-600">
                          Booked: {formatBooked(appt.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t bg-gray-50/70 px-6 py-5 flex flex-wrap gap-4">
                    {statusAction === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(appt.id, "confirmed", true)}
                          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-medium transition shadow-sm hover:shadow active:scale-[0.98] min-w-35"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(appt.id, "rejected")}
                          className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl font-medium transition shadow-sm hover:shadow active:scale-[0.98] min-w-35"
                        >
                          <XCircleIcon className="h-5 w-5" />
                          Reject
                        </button>
                      </>
                    )}

                    {statusAction === "confirmed" && (
                      <button
                        onClick={() => updateStatus(appt.id, "completed", true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition shadow-sm hover:shadow active:scale-[0.98] min-w-45"
                      >
                        <CheckBadgeIcon className="h-5 w-5" />
                        Mark as Completed
                      </button>
                    )}

                    {(statusAction === "completed" ||
                      statusAction === "rejected" ||
                      statusAction === "cancelled") && (
                      <div className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-600 py-3.5 rounded-xl font-medium cursor-not-allowed min-w-45 border border-gray-300">
                        <InformationCircleIcon className="h-5 w-5" />
                        {statusAction === "completed"
                          ? "Completed"
                          : statusAction === "rejected"
                          ? "Rejected"
                          : "Cancelled"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}