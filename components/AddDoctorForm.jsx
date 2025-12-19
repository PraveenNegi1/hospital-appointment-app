"use client";

import { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddDoctorForm() {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [email, setEmail] = useState("");

  const generateDefaultSlots = () => {
    const slots = {};
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      slots[dateStr] = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
    }
    return slots;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "doctors", email), {
      name,
      specialty,
      email,
      availableSlots: generateDefaultSlots(),
      approved: false,
      requestedAt: new Date(),
    });
    alert("Doctor added! Pending approval.");
    setName("");
    setSpecialty("");
    setEmail("");
  };

  return (
    <form
      onSubmit={handleAdd}
      className="bg-white p-8 rounded-lg shadow-lg max-w-lg"
    >
      <h3 className="text-2xl font-bold mb-6">
        Add New Doctor (Pending Approval)
      </h3>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border rounded mb-4"
        required
      />
      <input
        placeholder="Specialty"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
        className="w-full p-3 border rounded mb-4"
        required
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded mb-6"
        required
      />
      <button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded"
      >
        Request Doctor Addition
      </button>
    </form>
  );
}
