"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  CheckSquare,
  Trash2,
  Stethoscope,
  UserCheck,
  CalendarCheck,
  History,
  X,
} from "lucide-react";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [doctorName, setDoctorName] = useState("Doctor");
  const [processingId, setProcessingId] = useState(null);

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

  const handleAction = async (id, action) => {
    let confirmMsg = "";
    switch (action) {
      case "confirm":
        confirmMsg = "Confirm this appointment?";
        break;
      case "complete":
        confirmMsg = "Mark as completed?";
        break;
      case "cancel":
        confirmMsg = "Cancel this appointment?";
        break;
      case "delete":
        confirmMsg =
          "Permanently delete this cancelled appointment? This cannot be undone.";
        break;
      default:
        return;
    }

    if (!confirm(confirmMsg)) return;

    setProcessingId(id);
    try {
      if (action === "delete") {
        await deleteDoc(doc(db, "appointments", id));
        alert("Appointment deleted permanently.");
      } else {
        const updates = {
          confirm: { status: "confirmed", confirmedAt: new Date() },
          complete: { status: "completed", completedAt: new Date() },
          cancel: { status: "cancelled", cancelledAt: new Date() },
        }[action];

        await updateDoc(doc(db, "appointments", id), updates);
        alert(
          action === "confirm"
            ? "Appointment confirmed!"
            : action === "complete"
            ? "Marked as completed."
            : "Appointment cancelled."
        );
      }
    } catch (error) {
      console.error(error);
      alert("Operation failed.");
    } finally {
      setProcessingId(null);
    }
  };

  const getFilteredAppointments = () => {
    switch (activeTab) {
      case "pending":
        return appointments.filter(
          (a) => !a.status || a.status.toLowerCase() === "pending"
        );
      case "confirmed":
        return appointments.filter(
          (a) => a.status?.toLowerCase() === "confirmed"
        );
      case "completed":
        return appointments.filter(
          (a) => a.status?.toLowerCase() === "completed"
        );
      case "cancelled":
        return appointments.filter(
          (a) => a.status?.toLowerCase() === "cancelled"
        );
      default:
        return [];
    }
  };

  const getTabColor = (tab) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800 border-amber-300",
      confirmed: "bg-green-100 text-green-800 border-green-300",
      completed: "bg-blue-100 text-blue-800 border-blue-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[tab] || "bg-gray-100 text-gray-800";
  };

  const getTabIcon = (tab) => {
    const icons = {
      pending: <AlertCircle className="w-5 h-5" />,
      confirmed: <UserCheck className="w-5 h-5" />,
      completed: <CalendarCheck className="w-5 h-5" />,
      cancelled: <History className="w-5 h-5" />,
    };
    return icons[tab];
  };

  const filteredApps = getFilteredAppointments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center flex mb-10">
          <h1 className="text-4xl   text-gray-900 flex  gap-4">
            Doctor Dashboard
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-700 flex justify-end  w-[50vw]">
            Welcome back, {" "} 
            <span className="font-bold  text-indigo-700"> {" "} {doctorName}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 justify-center gap-4 mb-12">
          {["pending", "confirmed", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-md flex items-center gap-3 ${
                activeTab === tab
                  ? `${getTabColor(tab)} border-2 shadow-lg scale-105`
                  : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-transparent"
              }`}
            >
              {getTabIcon(tab)}
              {tab.charAt(0).toUpperCase() + tab.slice(1)} 
              <span className="ml-2 bg-white/70 px-3 py-1 rounded-full text-sm font-bold">
                {
                  appointments.filter(
                    (a) =>
                      (tab === "pending" &&
                        (!a.status || a.status.toLowerCase() === "pending")) ||
                      a.status?.toLowerCase() === tab
                  ).length
                }
              </span>
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-24 bg-white/80 backdrop-blur rounded-3xl shadow-2xl border border-gray-200">
            <Calendar className="w-28 h-28 text-gray-300 mx-auto mb-8" />
            <p className="text-3xl font-semibold text-gray-600">
              No {activeTab} 
            </p>
            <p className="text-xl text-gray-500 mt-4">
              {activeTab === "cancelled"
                ? "All cancelled appointments will appear here."
                : "Your appointments will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="bg-teal-600 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">
                          {app.patientName || "Unknown Patient"}
                        </h3>
                        <p className="text-sm opacity-90">
                          {app.patientAge && `${app.patientAge} years • `}
                          {app.patientGender || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-6 py-3 rounded-full font-bold text-lg border-2 ${getTabColor(
                        activeTab
                      )} text-white bg-white/20 border-white/50`}
                    >
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {/* Patient Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-gray-700">
                    {app.patientPhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-6 h-6 text-indigo-600" />
                        <span className="font-medium">{app.patientPhone}</span>
                      </div>
                    )}
                    {app.patientEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-6 h-6 text-indigo-600" />
                        <span className="font-medium">{app.patientEmail}</span>
                      </div>
                    )}
                    {app.patientAddress && (
                      <div className="flex items-start gap-3 sm:col-span-2">
                        <MapPin className="w-6 h-6 text-indigo-600 mt-0.5" />
                        <span className="font-medium">
                          {app.patientAddress}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Appointment Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-lg font-bold">
                          {format(getDateObject(app.date), "PPP")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Clock className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="text-lg font-bold">
                          {app.time || "Flexible"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Reason</p>
                        <p className="text-lg font-bold">
                          {app.reason || "General Checkup"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t">
                    {activeTab === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(app.id, "confirm")}
                          disabled={processingId === app.id}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition disabled:opacity-70"
                        >
                          <CheckCircle className="w-6 h-6" />
                          {processingId === app.id
                            ? "Confirming..."
                            : "Confirm"}
                        </button>
                        <button
                          onClick={() => handleAction(app.id, "cancel")}
                          disabled={processingId === app.id}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition disabled:opacity-70"
                        >
                          <XCircle className="w-6 h-6" />
                          Cancel
                        </button>
                      </>
                    )}

                    {activeTab === "confirmed" && (
                      <>
                        <button
                          onClick={() => handleAction(app.id, "complete")}
                          disabled={processingId === app.id}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition"
                        >
                          <CheckSquare className="w-6 h-6" />
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleAction(app.id, "cancel")}
                          disabled={processingId === app.id}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition"
                        >
                          <XCircle className="w-6 h-6" />
                          Cancel
                        </button>
                      </>
                    )}

                    {activeTab === "cancelled" && (
                      <button
                        onClick={() => handleAction(app.id, "delete")}
                        disabled={processingId === app.id}
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition col-span-2 lg:col-span-3"
                      >
                        <Trash2 className="w-6 h-6" />
                        {processingId === app.id
                          ? "Deleting..."
                          : "Delete Permanently"}
                      </button>
                    )}

                    {activeTab === "completed" && (
                      <div className="text-center text-green-700 font-bold text-xl py-6 col-span-2 lg:col-span-3">
                        Appointment Completed Successfully
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
