// app/dashboard/admin/page.jsx
"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AddDoctorForm from "@/components/AddDoctorForm";
import Link from "next/link";
import { UserCheck, Clock, Users, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "doctors"),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPendingDoctors(docs.filter((d) => !d.approved));
        setApprovedDoctors(docs.filter((d) => d.approved));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const approveDoctor = async (id) => {
    try {
      await updateDoc(doc(db, "doctors", id), { approved: true });
      alert("Doctor approved!");
    } catch (err) {
      alert("Error approving doctor.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-lg text-gray-600 mb-10">Manage doctor approvals and registrations</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-orange-600">{pendingDoctors.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approvedDoctors.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-blue-600">
              {pendingDoctors.length + approvedDoctors.length}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="mb-16">
          <AddDoctorForm />
        </div>

        {/* View Approved */}
        <div className="text-center mb-16">
          <Link
            href="/dashboard/admin/doctors"
            className="inline-flex items-center gap-3 bg-green-600 text-white py-4 px-8 rounded-xl hover:bg-green-700 transition font-bold"
          >
            <UserCheck className="w-6 h-6" />
            View All Approved Doctors
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Pending List */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Clock className="w-7 h-7" />
              Pending Approvals
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : pendingDoctors.length === 0 ? (
              <p className="text-center text-gray-600 py-10">No pending requests</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingDoctors.map((doctor) => (
                  <div key={doctor.id} className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <h4 className="font-bold text-xl">{doctor.name}</h4>
                    <p className="text-amber-700">{doctor.specialty}</p>
                    <p className="text-sm text-gray-600 mt-2">Email: {doctor.email}</p>
                    {doctor.phone && <p className="text-sm text-gray-600">Phone: {doctor.phone}</p>}
                    <button
                      onClick={() => approveDoctor(doctor.id)}
                      className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
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