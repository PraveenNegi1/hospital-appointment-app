"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Trash2,
} from "lucide-react";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
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
      orderBy("createdAt", "desc")
    );

    return onSnapshot(
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
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
        setLoading(false);
      }
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this appointment record?")) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "appointments", id));
      // list will auto-update via onSnapshot
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete appointment.");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusStyle = (status = "pending") => {
    const s = status.toLowerCase();
    if (s === "pending") return "bg-amber-100 text-amber-800 border-amber-300";
    if (s === "confirmed") return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (s === "completed") return "bg-blue-100   text-blue-800   border-blue-300";
    if (s === "rejected" || s === "cancelled") return "bg-rose-100 text-rose-800 border-rose-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  const canDelete = (status = "") => {
    const s = status.toLowerCase();
    return s === "completed" || s === "rejected" || s === "cancelled";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 font-sarif">
      <div className="max-w-5xl mx-auto ">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 font-sarif">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="mt-2 text-gray-600">
              View and manage all your booked consultations
            </p>
          </div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
          >
            <CalendarDays className="w-5 h-5" />
            Book New Appointment
          </Link>
        </div>

        {/* No appointments */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No appointments yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by booking your first consultation
            </p>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Find a Doctor
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appt) => {
              const statusStyle = getStatusStyle(appt.status);
              const isDeleting = deletingId === appt.id;
              const canBeDeleted = canDelete(appt.status);

              return (
                <div
                  key={appt.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Top bar - Doctor + Status + Date/Time */}
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm opacity-90 font-medium">
                          {appt.specialty || "General Consultation"}
                        </p>
                        <h3 className="text-xl font-semibold mt-1">
                          Dr. {appt.doctorName || "—"}
                        </h3>
                      </div>

                      <div className={`px-5 py-2 rounded-full text-sm font-medium border border-white/30 backdrop-blur-sm ${statusStyle}`}>
                        {appt.status ? appt.status.charAt(0).toUpperCase() + appt.status.slice(1) : "Pending"}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full">
                        <CalendarDays className="w-4 h-4" />
                        <span>{appt.date || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full">
                        <Clock className="w-4 h-4" />
                        <span>{appt.time || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="p-6 space-y-6">

                    {/* Reason */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Reason for Visit
                      </h4>
                      <p className="text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
                        {appt.reason || "Not specified"}
                      </p>
                    </div>

                    {/* Patient Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Patient Name</div>
                          <div className="font-medium">{appt.patientName || "—"}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Phone</div>
                          <div className="font-medium">{appt.patientPhone || "—"}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Email</div>
                          <div className="font-medium break-all">{appt.patientEmail || "—"}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Age & Gender</div>
                          <div className="font-medium">
                            {appt.patientAge ? `${appt.patientAge} years` : "—"} • {appt.patientGender || "—"}
                          </div>
                        </div>
                      </div>

                      {appt.patientAddress && (
                        <div className="flex items-start gap-4 sm:col-span-2 lg:col-span-1">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Address</div>
                            <div className="font-medium leading-relaxed">
                              {appt.patientAddress}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Booked timestamp */}
                    <div className="pt-4 border-t border-gray-100 text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Booked on{" "}
                      <span className="font-medium text-gray-800">
                        {appt.createdAt?.toDate
                          ? appt.createdAt.toDate().toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                          : "—"}
                      </span>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t flex flex-wrap gap-3">
                    {appt.status?.toLowerCase() === "pending" && (
                      <button className="flex-1 sm:flex-none sm:min-w-[160px] bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition">
                        Cancel Appointment
                      </button>
                    )}

                    {canBeDeleted && (
                      <button
                        onClick={() => handleDelete(appt.id)}
                        disabled={isDeleting}
                        className={`flex items-center justify-center gap-2 flex-1 sm:flex-none sm:min-w-[160px] 
                          bg-gray-700 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition
                          disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {isDeleting ? (
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete Record
                      </button>
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