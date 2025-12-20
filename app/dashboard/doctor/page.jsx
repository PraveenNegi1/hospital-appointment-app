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
import { Timestamp } from "firebase/firestore";
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
  CheckSquare,
} from "lucide-react";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [confirmingId, setConfirmingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [doctorName, setDoctorName] = useState("Doctor");

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setDoctorName(
          user.displayName || user.email?.split("@")[0] || "Doctor"
        );
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
      apps.sort((a, b) => getDateObject(b.date) - getDateObject(a.date));
      setAppointments(apps);
    });

    return unsub;
  }, []);

  const getDateObject = (dateField) => {
    if (!dateField) return new Date(0);
    if (dateField instanceof Timestamp) return dateField.toDate();
    return new Date(dateField);
  };

  const confirmAppointment = async (appointment) => {
    if (
      !confirm(
        `Confirm appointment with ${
          appointment.patientName || "patient"
        } on ${format(getDateObject(appointment.date), "PPP")} at ${
          appointment.time || "any time"
        }?`
      )
    ) {
      return;
    }

    setConfirmingId(appointment.id);
    try {
      await updateDoc(doc(db, "appointments", appointment.id), {
        status: "confirmed",
        confirmedAt: new Date(),
      });
      alert("Appointment confirmed!");
    } catch (error) {
      console.error(error);
      alert("Failed to confirm.");
    } finally {
      setConfirmingId(null);
    }
  };

  const cancelAppointment = async (appointment) => {
    if (
      !confirm(
        `Cancel this appointment with ${appointment.patientName || "patient"}?`
      )
    )
      return;

    setCancellingId(appointment.id);
    try {
      await updateDoc(doc(db, "appointments", appointment.id), {
        status: "cancelled",
        cancelledAt: new Date(),
      });
      alert("Appointment cancelled.");
    } catch (error) {
      console.error(error);
      alert("Failed to cancel.");
    } finally {
      setCancellingId(null);
    }
  };

  const completeAppointment = async (appointment) => {
    if (!confirm(`Mark appointment as completed?`)) return;

    setCompletingId(appointment.id);
    try {
      await updateDoc(doc(db, "appointments", appointment.id), {
        status: "completed",
        completedAt: new Date(),
      });
      alert("Marked as completed.");
    } catch (error) {
      console.error(error);
      alert("Failed.");
    } finally {
      setCompletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-2 border-green-300";
      case "completed":
        return "bg-blue-100 text-blue-800 border-2 border-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-2 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-2 border-yellow-300";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "Confirmed";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
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
              No appointments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {appointments.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <User className="w-8 h-8 text-green-600" />
                      {app.patientName || "Unknown Patient"}
                    </h3>
                    <div className="mt-3 space-y-2 text-gray-700">
                      {app.patientEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5" /> {app.patientEmail}
                        </div>
                      )}
                      {app.patientPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5" /> {app.patientPhone}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-6 py-3 rounded-full font-bold text-lg ${getStatusBadge(
                      app.status
                    )}`}
                  >
                    {getStatusText(app.status)}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="flex gap-3">
                    <Calendar className="w-6 h-6 text-green-600" />{" "}
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">
                        {format(getDateObject(app.date), "PPP")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="w-6 h-6 text-blue-600" />{" "}
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-semibold">{app.time || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AlertCircle className="w-6 h-6 text-orange-600" />{" "}
                    <div>
                      <p className="text-sm text-gray-500">Reason</p>
                      <p className="font-semibold">{app.reason || "Checkup"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* CONFIRM BUTTON - Only if pending */}
                  {(app.status === "pending" || !app.status) && (
                    <button
                      onClick={() => confirmAppointment(app)}
                      disabled={confirmingId === app.id}
                      className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      <CheckCircle className="w-6 h-6" />
                      {confirmingId === app.id
                        ? "Confirming..."
                        : "Confirm Appointment"}
                    </button>
                  )}

                  {/* MARK COMPLETED - Only if confirmed */}
                  {app.status === "confirmed" && (
                    <button
                      onClick={() => completeAppointment(app)}
                      disabled={completingId === app.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl flex items-center justify-center gap-2"
                    >
                      <CheckSquare className="w-6 h-6" />
                      Mark as Completed
                    </button>
                  )}

                  {/* CANCEL BUTTON - If not already cancelled/completed */}
                  {app.status !== "cancelled" && app.status !== "completed" && (
                    <button
                      onClick={() => cancelAppointment(app)}
                      disabled={cancellingId === app.id}
                      className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      <XCircle className="w-6 h-6" />
                      {cancellingId === app.id
                        ? "Cancelling..."
                        : "Cancel Appointment"}
                    </button>
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
