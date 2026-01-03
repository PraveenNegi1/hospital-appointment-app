// app/dashboard/admin/page.jsx
"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AddDoctorForm from "@/components/AddDoctorForm";
import Link from "next/link";
import { UserCheck, Clock, Users, AlertCircle } from "lucide-react"; // ← Added Users

export default function AdminDashboard() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "doctors"),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPendingDoctors(docs.filter((d) => !d.approved));
        setApprovedDoctors(docs.filter((d) => d.approved));
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Failed to load doctors. Check permissions or network.");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const approveDoctor = async (id, name) => {
    if (!confirm(`Approve Dr. ${name}? This will make them visible to patients.`)) {
      return;
    }

    try {
      await updateDoc(doc(db, "doctors", id), { approved: true });
      alert(`Dr. ${name} has been approved!`);
    } catch (err) {
      console.error(err);
      alert("Error approving doctor.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage doctor registrations and approvals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
            <Clock className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Pending Approvals</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">{pendingDoctors.length}</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
            <UserCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Approved Doctors</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{approvedDoctors.length}</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" /> {/* ← Now works! */}
            <p className="text-gray-600 text-lg">Total Doctors</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {pendingDoctors.length + approvedDoctors.length}
            </p>
          </div>
        </div>

        {/* Add Doctor Form */}
        <div className="mb-16 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Add New Doctor</h2>
          <AddDoctorForm />
        </div>

        {/* View Approved Doctors Button */}
        <div className="text-center mb-16">
          <Link
            href="/dashboard/admin/doctors"
            className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-green-700 hover:to-emerald-700 transition shadow-xl"
          >
            <UserCheck className="w-8 h-8" />
            View All Approved Doctors
          </Link>
        </div>

        {/* Pending Doctors Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-4">
              <Clock className="w-10 h-10" />
              Pending Doctor Approvals
            </h2>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4 text-red-700">
                <AlertCircle className="w-8 h-8" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600"></div>
                <p className="mt-6 text-xl text-gray-600">Loading doctors...</p>
              </div>
            ) : pendingDoctors.length === 0 ? (
              <div className="text-center py-20">
                <UserCheck className="w-20 h-20 text-green-600 mx-auto mb-6" />
                <p className="text-2xl text-gray-700 font-medium">No pending approvals</p>
                <p className="text-gray-500 mt-2">All doctors are approved!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pendingDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border-2 border-amber-200 hover:shadow-2xl transition"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-lg text-amber-700 font-medium mb-4">
                      {doctor.specialty}
                    </p>
                    <div className="space-y-2 text-gray-700">
                      <p className="text-sm">
                        <strong>Email:</strong> {doctor.email}
                      </p>
                      {doctor.phone && (
                        <p className="text-sm">
                          <strong>Phone:</strong> {doctor.phone}
                        </p>
                      )}
                      {doctor.experience && (
                        <p className="text-sm">
                          <strong>Experience:</strong> {doctor.experience} years
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => approveDoctor(doctor.id, doctor.name)}
                      className="mt-8 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
                    >
                      Approve Doctor
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}