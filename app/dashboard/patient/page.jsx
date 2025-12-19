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
import DoctorCard from "@/components/DoctorCard";
import BookingModal from "@/components/BookingModal";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore"; // Add this import
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  XCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState("book");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch approved doctors
    const unsubDoctors = onSnapshot(
      query(collection(db, "doctors"), where("approved", "==", true)),
      (snap) => {
        setDoctors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (error) => console.error("Error fetching doctors:", error)
    );

    // Fetch patient's appointments
    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", auth.currentUser.uid)
    );

    const unsubApps = onSnapshot(
      q,
      (snap) => {
        const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Sort by date/time (newest first)
        apps.sort((a, b) => {
          const dateA = getDateObject(a.date);
          const dateB = getDateObject(b.date);
          return dateB - dateA;
        });

        setAppointments(apps);
      },
      (error) => console.error("Error fetching appointments:", error)
    );

    return () => {
      unsubDoctors();
      unsubApps();
    };
  }, []);

  // Helper: Convert Firestore Timestamp or string to Date object
  const getDateObject = (dateField) => {
    if (!dateField) return new Date(0);
    if (dateField instanceof Timestamp) {
      return dateField.toDate();
    }
    // If it's a string like "2025-12-25"
    return new Date(dateField);
  };

  // Helper: Safely format date
  const formatAppointmentDate = (dateField) => {
    const date = getDateObject(dateField);
    return isNaN(date.getTime()) ? "Invalid Date" : format(date, "PPP");
  };

  const cancelAppointment = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    setCancellingId(appointmentId);
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "cancelled",
        cancelledAt: new Date(),
      });
      alert("Appointment cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
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
        return "Pending Confirmation";
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex gap-10 border-b-2 border-gray-200 mb-12">
          <button
            onClick={() => setActiveTab("book")}
            className={`pb-4 px-2 text-xl font-bold transition-all duration-300 border-b-4 
              ${
                activeTab === "book"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
          >
            Book Appointment
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-4 px-2 text-xl font-bold transition-all duration-300 border-b-4 relative
              ${
                activeTab === "history"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
          >
            My Appointments
            {appointments.length > 0 && (
              <span className="absolute -top-3 -right-6 bg-blue-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center">
                {appointments.length}
              </span>
            )}
          </button>
        </div>

        {/* Book Appointment Tab */}
        {activeTab === "book" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-4">
              <Stethoscope className="w-12 h-12 text-blue-600" />
              Available Doctors
            </h2>

            {doctors.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
                <p className="text-2xl text-gray-600 font-medium">
                  No approved doctors available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBook={() => setSelectedDoctor(doctor)}
                  />
                ))}
              </div>
            )}

            {selectedDoctor && (
              <BookingModal
                doctor={selectedDoctor}
                onClose={() => setSelectedDoctor(null)}
              />
            )}
          </div>
        )}

        {/* Appointment History Tab */}
        {activeTab === "history" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-4">
              <Calendar className="w-12 h-12 text-purple-600" />
              My Appointment History
            </h2>

            {appointments.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl shadow-2xl">
                <AlertCircle className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <p className="text-2xl text-gray-600 font-semibold">
                  No appointments booked yet.
                </p>
                <p className="text-gray-500 mt-3 text-lg">
                  Switch to "Book Appointment" to schedule your first visit!
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
                          <div className="flex items-center gap-4 mb-2">
                            <User className="w-8 h-8 text-blue-600" />
                            <h3 className="text-2xl font-bold text-gray-900">
                              Dr. {app.doctorName || "Unknown Doctor"}
                            </h3>
                          </div>
                          <p className="text-lg text-gray-600 flex items-center gap-3">
                            <Stethoscope className="w-6 h-6 text-purple-600" />
                            {app.specialty || "General Medicine"}
                          </p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-6 py-3 rounded-full text-base font-bold ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {getStatusText(app.status)}
                          </span>
                          {app.status === "confirmed" && (
                            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mt-3" />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700 mb-8">
                        <div className="flex items-center gap-4">
                          <Calendar className="w-7 h-7 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Date
                            </p>
                            <p className="text-lg font-semibold">
                              {app.date
                                ? formatAppointmentDate(app.date)
                                : "Not set"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Clock className="w-7 h-7 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Time
                            </p>
                            <p className="text-lg font-semibold">
                              {app.time && app.time.trim() !== ""
                                ? app.time
                                : "Not set"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <AlertCircle className="w-7 h-7 text-orange-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Reason
                            </p>
                            <p className="text-lg font-semibold">
                              {app.reason || "Routine Checkup"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Cancel Button - Only if not cancelled/completed and future date */}
                      {app.status !== "cancelled" &&
                        app.status !== "completed" &&
                        getDateObject(app.date) > new Date() && (
                          <button
                            onClick={() => cancelAppointment(app.id)}
                            disabled={cancellingId === app.id}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg disabled:opacity-70"
                          >
                            <XCircle className="w-6 h-6" />
                            {cancellingId === app.id
                              ? "Cancelling..."
                              : "Cancel Appointment"}
                          </button>
                        )}

                      {app.status === "cancelled" && (
                        <p className="text-center text-red-700 font-semibold text-lg mt-4">
                          <XCircle className="w-8 h-8 inline-block mr-3" />
                          This appointment has been cancelled.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
