"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, Trash2, Clock, UserCheck } from "lucide-react";

// API helpers
async function fetchDoctors() {
  const res = await fetch("/api/get-doctors");
  const data = await res.json();
  return data.doctors || [];
}

async function createDoctorApi(doctor) {
  const res = await fetch("/api/create-doctor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doctor),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error: ${text}`);
  }

  return await res.json();
}

async function updateDoctorApi(id, updateData) {
  await fetch("/api/update-doctor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, updateData }),
  });
}

async function deleteDoctorApi(id) {
  await fetch("/api/delete-doctor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    experience: "",
    bio: "",
    fee: "",
  });

  const specialties = [
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Dermatology",
    "Gynecology",
    "General Medicine",
    "ENT",
    "Ophthalmology",
    "Gastroenterology",
    "Urology",
  ];

  const fetchAll = async () => {
    setLoading(true);
    const data = await fetchDoctors();
    setDoctors(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const doctorData = {
        name: form.name,
        email: form.email,
        password: form.password,
        specialty: form.specialty,
        experience: form.experience,
        bio: form.bio,
        fee: form.fee,
      };

      const data = await createDoctorApi(doctorData);
      console.log("Doctor created:", data);

      // Refresh list
      fetchAll();

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        specialty: "",
        experience: "",
        bio: "",
        fee: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error("Error creating doctor:", err);
    }
  };

  const approveDoctor = async (id) => {
    await updateDoctorApi(id, { approved: true });
    fetchAll();
  };

  const deleteDoctor = async (id) => {
    if (!confirm("Delete doctor?")) return;
    await deleteDoctorApi(id);
    fetchAll();
  };

  const pendingDoctors = doctors.filter((d) => !d.approved);
  const approvedDoctors = doctors.filter((d) => d.approved);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-600">
          Admin Dashboard
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 mt-4 md:mt-0"
        >
          <Plus size={18} /> {showForm ? "Hide Form" : "Add Doctor"}
        </button>
      </div>

      {/* Add Doctor Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Doctor</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              required
              className="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Specialty</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Experience (years)"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              className="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="number"
              placeholder="Consultation Fee (₹)"
              value={form.fee}
              onChange={(e) => setForm({ ...form, fee: e.target.value })}
              className="border p-3 rounded w-full focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="border p-3 rounded w-full md:col-span-2 focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 md:col-span-2"
            >
              Create Doctor
            </button>
          </form>
        </div>
      )}

      {/* Pending Doctors */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Clock size={18} /> Pending Doctors
        </h2>
        {pendingDoctors.length === 0 ? (
          <p className="text-gray-500">No pending doctors</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingDoctors.map((d) => (
              <div
                key={d.id}
                className="bg-white p-4 rounded-xl shadow flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg">{d.name}</h3>
                  <p className="text-gray-600">{d.specialty}</p>
                  <p className="text-gray-600">Fee: ₹{d.fee || "N/A"}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => approveDoctor(d.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded flex-1 hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setSelectedDoctor(d)}
                    className="bg-blue-600 text-white px-3 py-1 rounded flex-1 hover:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => deleteDoctor(d.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded flex-1 hover:bg-red-700 flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Approved Doctors */}
      <section>
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <UserCheck size={18} /> Approved Doctors
        </h2>
        {approvedDoctors.length === 0 ? (
          <p className="text-gray-500">No approved doctors</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedDoctors.map((d) => (
              <div
                key={d.id}
                className="bg-white p-4 rounded-xl shadow flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg">{d.name}</h3>
                  <p className="text-gray-600">{d.specialty}</p>
                  <p className="text-gray-600">Fee: ₹{d.fee || "N/A"}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setSelectedDoctor(d)}
                    className="bg-blue-600 text-white px-3 py-1 rounded flex-1 hover:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => deleteDoctor(d.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded flex-1 hover:bg-red-700 flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Doctor Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-3 right-3 text-gray-600 font-bold hover:text-gray-900"
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedDoctor.name}</h2>
            <p>
              <strong>Email:</strong> {selectedDoctor.email}
            </p>
            <p>
              <strong>Specialty:</strong> {selectedDoctor.specialty}
            </p>
            <p>
              <strong>Experience:</strong> {selectedDoctor.experience} years
            </p>
            <p>
              <strong>Fee:</strong> ₹{selectedDoctor.fee}
            </p>
            <p>
              <strong>Bio:</strong> {selectedDoctor.bio}
            </p>
            <p>
              <strong>Approved:</strong>{" "}
              {selectedDoctor.approved ? "Yes" : "No"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
