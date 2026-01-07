'use client';

import { deleteDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AppointmentCard({ app, isPatient, onCancel }) {
  const handleCancel = async () => {
    if (!confirm("Cancel this appointment?")) return;

    try {
      await updateDoc(doc(db, 'doctors', app.doctorId), {
        [`availableSlots.${app.date}`]: arrayUnion(app.slot)
      });

      await deleteDoc(doc(db, 'appointments', app.id));

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: isPatient ? app.doctorEmail || 'doctor@hospital.com' : app.patientEmail || 'patient@hospital.com',
          subject: 'Appointment Cancelled',
          text: `Appointment on ${app.date} at ${app.slot} has been cancelled.`
        })
      });

      alert("Appointment cancelled");
      onCancel?.();
    } catch (err) {
      alert("Cancellation failed");
    }
  };

  return (
    <div className="border p-6 rounded-lg bg-white shadow hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xl font-bold">{isPatient ? app.doctorName : app.patientName}</p>
          <p className="text-gray-600">{isPatient ? app.doctorSpecialty : `Patient`}</p>
          <p className="mt-2"><strong>Date:</strong> {app.date} | <strong>Time:</strong> {app.slot}</p>
          <p className="text-sm text-gray-500 mt-2">Booked: {new Date(app.createdAt?.seconds * 1000).toLocaleString()}</p>
        </div>
        <button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}