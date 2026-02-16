"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  X,
  Loader2,
} from "lucide-react";

export default function BookingModal({ doctor, onClose }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [patientName, setPatientName] = useState(auth.currentUser?.displayName || "");
  const [patientPhone, setPatientPhone] = useState(auth.currentUser?.phoneNumber || "");
  const [patientEmail] = useState(auth.currentUser?.email || "");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleBook = async () => {
    setErrorMsg("");

    if (!auth.currentUser) {
      setErrorMsg("You must be logged in to book an appointment.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      setErrorMsg("Please select both date and time.");
      return;
    }

    if (!reason.trim()) {
      setErrorMsg("Please enter a reason for the visit.");
      return;
    }

    if (!patientName.trim() || !patientPhone.trim() || !patientAge || !patientGender) {
      setErrorMsg("Please fill in all required patient information.");
      return;
    }

    const doctorDocId = doctor?.uid || doctor?.id || doctor?.email;

    if (!doctorDocId) {
      setErrorMsg("Doctor information is incomplete. Cannot book.");
      console.error("Missing doctor identifier:", doctor);
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "appointments"), {
        patientId: auth.currentUser.uid,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail,
        patientAge: Number(patientAge),
        patientGender,
        patientAddress: patientAddress.trim() || null,
        doctorId: doctorDocId,
        doctorName: doctor.name || doctor.fullName || "Doctor",
        specialty: doctor.specialty || "General Medicine",
        date: selectedDate,
        time: selectedTime,
        reason: reason.trim(),
        status: "pending",
        createdAt: new Date(),
      });

      alert("Appointment requested successfully! Doctor will confirm soon.");
      onClose();
    } catch (err) {
      console.error("Booking error:", err);
      let message = "Failed to book appointment. Please try again.";

      if (err.code === "permission-denied") {
        message = "Permission denied – check login status or Firestore rules.";
      } else if (err.message) {
        message = err.message;
      }

      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center  p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[97vh] my-8 sm:mx-4">
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-6 text-white relative">
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl  font-bold">Book Appointment</h2>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Stethoscope className="w-8 h-8" />
              <div>
                <p className="text-lg sm:text-xl font-semibold">
                  Dr. {doctor?.name || doctor?.fullName || "Doctor"}
                </p>
                <p className="text-sm opacity-90">
                  {doctor?.specialty || "General Physician"}
                </p>
              </div>
            </div>
            {doctor?.fee > 0 && (
              <p className="mt-3 text-lg">
                Consultation Fee: <span className="font-bold">₹{doctor.fee}</span>
              </p>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 cursor-pointer"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Select Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 cursor-pointer"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-purple-600" />
              Patient Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-gray-600">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full p-4 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-gray-600">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    value={patientEmail}
                    disabled
                    className="w-full p-4 bg-gray-100 border border-gray-300 rounded-r-xl cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 32"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                  disabled={loading}
                >
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Address (Optional)
                </label>
                <textarea
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  placeholder="Full address for records (optional)"
                  rows="2"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Visit *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your symptoms or reason (e.g., fever, routine checkup, follow-up)"
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="p-6 sm:p-8 border-t bg-gray-50 rounded-b-3xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleBook}
              disabled={
                loading ||
                !selectedDate ||
                !selectedTime ||
                !patientName.trim() ||
                !patientPhone.trim() ||
                !patientAge ||
                !patientGender ||
                !reason.trim()
              }
              className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl shadow-lg transition flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="px-8 py-5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-2xl transition flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
