"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function BookingModal({ doctor, onClose }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const availableDates = doctor.availableSlots || {};
  const slotsForDate = selectedDate ? availableDates[selectedDate] || [] : [];

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time slot.");
      return;
    }

    if (!reason.trim()) {
      alert("Please provide a reason for your visit.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create appointment with status: "pending"
      const appointmentRef = await addDoc(collection(db, "appointments"), {
        patientId: auth.currentUser.uid,
        patientName:
          auth.currentUser.displayName || auth.currentUser.email.split("@")[0],
        patientEmail: auth.currentUser.email,
        // Optional: add phone if you have it in auth or profile
        // patientPhone: auth.currentUser.phoneNumber || "",
        doctorId: doctor.email, // using email as identifier
        doctorName: doctor.name,
        specialty: doctor.specialty || "General Medicine",
        date: selectedDate, // e.g., "2025-12-25"
        time: selectedTime, // e.g., "10:00 AM"
        reason: reason.trim(),
        status: "pending", // ← CRITICAL: Changed from "booked"
        createdAt: new Date(),
      });

      // 2. Remove the booked time slot from doctor's availability
      await updateDoc(doc(db, "doctors", doctor.email), {
        [`availableSlots.${selectedDate}`]: arrayRemove(selectedTime),
      });

      alert(
        "Appointment booked successfully! Waiting for doctor's confirmation."
      );
      onClose();
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to book appointment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Book Appointment
        </h2>
        <p className="text-center text-gray-700 mb-8">
          With <span className="font-semibold">Dr. {doctor.name}</span>
          <br />
          <span className="text-sm text-gray-500">
            {doctor.specialty || "General Physician"}
          </span>
        </p>

        {/* Select Date */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime(""); // reset time
            }}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">-- Choose a Date --</option>
            {Object.keys(availableDates)
              .sort() // optional: sort dates
              .map((date) => (
                <option key={date} value={date}>
                  {date} ({availableDates[date].length} slot
                  {availableDates[date].length !== 1 ? "s" : ""} available)
                </option>
              ))}
          </select>
        </div>

        {/* Select Time */}
        {selectedDate && slotsForDate.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">-- Choose a Time --</option>
              {slotsForDate.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedDate && slotsForDate.length === 0 && (
          <p className="text-red-600 text-center mb-4">
            No available slots on this date.
          </p>
        )}

        {/* Reason for Visit */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reason for Visit
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="E.g., General checkup, fever, follow-up..."
            rows="3"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBook}
            disabled={!selectedTime || !reason.trim() || loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition shadow-lg"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
