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
import BookingModal from "@/components/BookingModal";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  XCircle,
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  IndianRupee,
  GraduationCap,
  Briefcase,
  X,
  Eye,
} from "lucide-react";

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState("book");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubDoctors = onSnapshot(
      query(collection(db, "doctors"), where("approved", "==", true)),
      (snap) => {
        setDoctors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", auth.currentUser.uid)
    );

    const unsubApps = onSnapshot(q, (snap) => {
      const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      apps.sort((a, b) => getDateObject(b.date) - getDateObject(a.date));

      // Hide cancelled appointments
      const activeApps = apps.filter(
        (app) => app.status?.toLowerCase() !== "cancelled"
      );
      setAppointments(activeApps);
    });

    return () => {
      unsubDoctors();
      unsubApps();
    };
  }, []);

  const getDateObject = (dateField) => {
    if (!dateField) return new Date(0);
    if (dateField instanceof Timestamp) return dateField.toDate();
    return new Date(dateField);
  };

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
      console.error("Error:", error);
      alert("Failed to cancel.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "Confirmed";
      case "completed":
        return "Completed";
      default:
        return "Pending";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-6 border-b border-gray-200 pb-6 mb-12">
          <button
            onClick={() => setActiveTab("book")}
            className={`text-xl sm:text-2xl pb-4 border-b-4 transition-all duration-300 ${
              activeTab === "book"
                ? "text-teal-600 border-teal-700"
                : "text-gray-400 border-transparent hover:text-gray-500"
            }`}
          >
            Book Appointment
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`text-xl sm:text-2xl  pb-4 border-b-4 relative transition-all duration-300 ${
              activeTab === "history"
                ? "text-teal-600 border-teal-700"
                : "text-gray-400 border-transparent hover:text-gray-500"
            }`}
          >
            My Appointments
            {appointments.length > 0 && (
              <span className="absolute -top-2 -right-8 bg-teal-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center">
                {appointments.length}
              </span>
            )}
          </button>
        </div>

        {/* Book Appointment Tab */}
        {activeTab === "book" && (
          <div>
            <h2 className="text-3xl   text-gray-900 mb-10 flex items-center gap-4">
              Available Doctors
            </h2>

            {doctors.length === 0 ? (
              <div className="text-center py-24 bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-gray-100">
                <Stethoscope className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <p className="text-2xl text-gray-600 font-medium">
                  No doctors available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full"
                  >
                    {/* Gradient Header with Photo Placeholder */}
                    <div className="relative h-48 bg-white flex items-center justify-center">
                      <div className="absolute inset-0 bg-black/20" />
                      <User className="w-20 h-20 text-white/90 z-10" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20">
                        <h3 className="text-xl font-bold">
                          Dr. {doctor.name || "Unknown"}
                        </h3>
                        <p className="text-sm opacity-90">
                          {doctor.specialty || "Specialist"}
                        </p>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        {doctor.experience > 0 && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <Briefcase className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium">
                              {doctor.experience} years experience
                            </span>
                          </div>
                        )}
                        {doctor.fee > 0 && (
                          <div className="flex items-center gap-3">
                            <IndianRupee className="w-6 h-6 text-emerald-600" />
                            <span className="text-xl font-bold text-emerald-700">
                              ₹{doctor.fee}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => setViewDoctor(doctor)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => setSelectedDoctor(doctor)}
                          className="flex-1 bg-teal-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition text-sm flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Booking Modal */}
            {selectedDoctor && (
              <BookingModal
                doctor={selectedDoctor}
                onClose={() => setSelectedDoctor(null)}
              />
            )}

            {/* Doctor Details Modal */}
            {viewDoctor && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Doctor Profile
                    </h3>
                    <button
                      onClick={() => setViewDoctor(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <X className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-16 h-16 text-white" />
                      </div>
                      <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-bold text-gray-900">
                          Dr. {viewDoctor.name}
                        </h2>
                        <p className="text-xl text-gray-600 mt-1">
                          {viewDoctor.specialty}
                        </p>
                        {viewDoctor.fee > 0 && (
                          <p className="text-2xl font-bold text-gray-600 mt-3 flex items-center gap-2 justify-center sm:justify-start">
                            <IndianRupee className="w-7 h-7" />
                            {viewDoctor.fee}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-5 text-base">
                      {viewDoctor.qualifications && (
                        <div className="flex items-start gap-4">
                          <GraduationCap className="w-6 h-6 text-gray-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-600">
                              Qualifications
                            </p>
                            <p className="text-gray-800">
                              {viewDoctor.qualifications}
                            </p>
                          </div>
                        </div>
                      )}
                      {viewDoctor.experience > 0 && (
                        <div className="flex items-center gap-4">
                          <Briefcase className="w-6 h-6 text-gray-600" />
                          <p className="text-gray-800 font-medium">
                            {viewDoctor.experience} years experience
                          </p>
                        </div>
                      )}
                      {viewDoctor.clinicName && (
                        <div className="flex items-center gap-4">
                          <Stethoscope className="w-6 h-6 text-gray-600" />
                          <p className="text-gray-800 font-medium">
                            {viewDoctor.clinicName}
                          </p>
                        </div>
                      )}
                      {viewDoctor.address && (
                        <div className="flex items-start gap-4">
                          <MapPin className="w-6 h-6 text-gray-600 mt-0.5" />
                          <p className="text-gray-700">{viewDoctor.address}</p>
                        </div>
                      )}
                      {viewDoctor.phone && (
                        <div className="flex items-center gap-4">
                          <Phone className="w-6 h-6 text-gray-600" />
                          <p className="text-gray-800 font-medium">
                            {viewDoctor.phone}
                          </p>
                        </div>
                      )}
                      {viewDoctor.bio && (
                        <div className="pt-4 border-t">
                          <p className="font-medium text-gray-600 mb-2">
                            About
                          </p>
                          <p className="text-gray-700 leading-relaxed">
                            {viewDoctor.bio}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDoctor(viewDoctor);
                        setViewDoctor(null);
                      }}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg text-lg transition"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* My Appointments Tab */}
        {activeTab === "history" && (
          <div>
            <h2 className="text-3xl sm:text-4xl  text-gray-900 mb-10 flex items-center gap-4">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
              My Appointments
            </h2>

            {appointments.length === 0 ? (
              <div className="text-center py-24 bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-gray-100">
                <AlertCircle className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <p className="text-2xl text-gray-600 font-medium">
                  No active appointments
                </p>
                <p className="text-gray-500 mt-3">
                  Book your first consultation today!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {appointments.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-gray-100 p-6"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              Dr. {app.doctorName}
                            </h3>
                            <p className="text-gray-600">
                              {app.specialty || "General Medicine"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-7 h-7 text-emerald-600" />
                            <div>
                              <p className="text-xs text-gray-500">Date</p>
                              <p className="font-semibold">
                                {formatAppointmentDate(app.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-7 h-7 text-indigo-600" />
                            <div>
                              <p className="text-xs text-gray-500">Time</p>
                              <p className="font-semibold">
                                {app.time || "TBD"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-7 h-7 text-purple-600" />
                            <div>
                              <p className="text-xs text-gray-500">Reason</p>
                              <p className="font-semibold">
                                {app.reason || "Checkup"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center lg:items-end justify-center gap-4">
                        <span
                          className={`px-6 py-3 rounded-full text-sm font-bold border-2 ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusText(app.status)}
                        </span>
                        {(app.status === "pending" ||
                          app.status === "confirmed") &&
                          getDateObject(app.date) > new Date() && (
                            <button
                              onClick={() => cancelAppointment(app.id)}
                              disabled={cancellingId === app.id}
                              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition disabled:opacity-70 flex items-center gap-2 text-sm"
                            >
                              <XCircle className="w-5 h-5" />
                              {cancellingId === app.id
                                ? "Cancelling..."
                                : "Cancel"}
                            </button>
                          )}
                      </div>
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
