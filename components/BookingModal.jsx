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
  const [selectedSlot, setSelectedSlot] = useState("");

  const availableDates = doctor.availableSlots || {};
  const slotsForDate = selectedDate ? availableDates[selectedDate] || [] : [];

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) {
      alert("Please select date and time");
      return;
    }

    try {
      // Add appointment
      await addDoc(collection(db, "appointments"), {
        patientId: auth.currentUser.uid,
        patientName:
          auth.currentUser.displayName || auth.currentUser.email.split("@")[0],
        doctorId: doctor.email, // using email as ID
        doctorName: doctor.name,
        date: selectedDate,
        slot: selectedSlot,
        status: "booked",
        createdAt: new Date(),
      });

      // Remove slot from doctor's availability
      await updateDoc(doc(db, "doctors", doctor.email), {
        [`availableSlots.${selectedDate}`]: arrayRemove(selectedSlot),
      });

      alert("Appointment booked successfully!");
      onClose();
    } catch (err) {
      alert("Booking failed: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Book with Dr. {doctor.name}
        </h2>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Select Date</label>
          <select
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot("");
            }}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">-- Choose Date --</option>
            {Object.keys(availableDates).map((date) => (
              <option key={date} value={date}>
                {date} ({availableDates[date].length} slots left)
              </option>
            ))}
          </select>
        </div>

        {selectedDate && (
          <div className="mb-6">
            <label className="block font-semibold mb-2">Select Time</label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">-- Choose Time --</option>
              {slotsForDate.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleBook}
            disabled={!selectedSlot}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
          >
            Confirm Booking
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
