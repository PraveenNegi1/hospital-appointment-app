"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore"; // Import Timestamp
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  Stethoscope,
  XCircle,
} from "lucide-react";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [confirmingId, setConfirmingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [doctorName, setDoctorName] = useState("Doctor");

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setDoctorName(
          user.displayName || user.email?.split("@")[0] || "Doctor"
        );
      } else {
        setDoctorName("Doctor");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", auth.currentUser.email)
    );

    const unsub = onSnapshot(q, (snap) => {
      const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      apps.sort((a, b) => {
        const dateA = getDateObject(a.date);
        const dateB = getDateObject(b.date);
        return dateB - dateA; // Latest first
      });
      setAppointments(apps);
    });

    return unsub;
  }, []);

  // Helper to safely convert date (string or Timestamp) to Date object
  const getDateObject = (dateField) => {
    if (!dateField) return new Date(0);
    if (dateField instanceof Timestamp) {
      return dateField.toDate();
    }
    return new Date(dateField);
  };

  // Helper to format date safely
  const formatDate = (dateField) => {
    const date = getDateObject(dateField);
    return isNaN(date.getTime()) ? "Invalid Date" : format(date, "PPP");
  };

  const confirmAppointment = async (appointmentId) => {
    if (!confirm("Confirm this appointment?")) return;

    setConfirmingId(appointmentId);
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "confirmed",
        confirmedAt: new Date(),
      });
      alert("Appointment confirmed successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to confirm.");
    } finally {
      setConfirmingId(null);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!confirm("Cancel this appointment? This cannot be undone.")) return;

    setCancellingId(appointmentId);
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "cancelled",
        cancelledAt: new Date(),
      });
      alert("Appointment cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling:", error);
      alert("Failed to cancel.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-4">
            <Stethoscope className="w-12 h-12 text-green-600" />
            My Appointments
          </h1>
          <p className="mt-3 text-xl text-gray-700">
            Welcome back,{" "}
            <span className="font-semibold text-green-700">{doctorName}</span>
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <p className="text-2xl text-gray-600 font-medium">
              No appointments scheduled yet.
            </p>
            <p className="text-gray-500 mt-3">
              Patients will appear here once they book with you.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {appointments.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <User className="w-8 h-8 text-green-600" />
                        <h3 className="text-2xl font-bold text-gray-900">
                          {app.patientName || "Unknown Patient"}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        {app.patientEmail && (
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <span>{app.patientEmail}</span>
                          </div>
                        )}
                        {app.patientPhone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-purple-600" />
                            <span>{app.patientPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-5 py-2 rounded-full text-sm font-bold border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status
                        ? app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)
                        : "Pending"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-gray-700">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-lg">
                          {app.date ? formatDate(app.date) : "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Clock className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-semibold text-lg">
                          {app.time || "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">Reason</p>
                        <p className="font-semibold text-lg">
                          {app.reason || "General Checkup"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {/* Confirm Button */}
                    {(app.status === "pending" || !app.status) && (
                      <button
                        onClick={() => confirmAppointment(app.id)}
                        disabled={confirmingId === app.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                      >
                        <CheckCircle className="w-6 h-6" />
                        {confirmingId === app.id ? "Confirming..." : "Confirm"}
                      </button>
                    )}

                    {/* Cancel Button - Show for pending or confirmed */}
                    {app.status !== "cancelled" &&
                      app.status !== "completed" && (
                        <button
                          onClick={() => cancelAppointment(app.id)}
                          disabled={cancellingId === app.id}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                        >
                          <XCircle className="w-6 h-6" />
                          {cancellingId === app.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                  </div>

                  {/* Status Messages */}
                  {app.status === "confirmed" && app.status !== "pending" && (
                    <div className="mt-6 text-center text-green-700 font-semibold text-lg">
                      <CheckCircle className="w-8 h-8 inline-block mr-2" />
                      Appointment Confirmed
                    </div>
                  )}

                  {app.status === "cancelled" && (
                    <div className="mt-6 text-center text-red-700 font-semibold text-lg">
                      <XCircle className="w-8 h-8 inline-block mr-2" />
                      Appointment Cancelled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
