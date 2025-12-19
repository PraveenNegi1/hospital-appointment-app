"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Add this import
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Trash2,
  UserCheck,
  Phone,
  Mail,
  Stethoscope,
  AlertCircle,
  ArrowLeft, // New icon for back button
} from "lucide-react";

export default function AdminDoctorsDashboard() {
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter(); // For navigation

  useEffect(() => {
    const q = query(collection(db, "doctors"), where("approved", "==", true));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setApprovedDoctors(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching approved doctors:", error);
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  const deleteDoctor = async (doctorId, doctorName) => {
    if (
      !confirm(
        `Are you sure you want to delete Dr. ${doctorName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(doctorId);
    try {
      await deleteDoc(doc(db, "doctors", doctorId));
      alert("Doctor deleted successfully.");
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-5xl flex items-center gap-4">
              <UserCheck className="w-12 h-12 text-green-600" />
              Approved Doctors Management
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              View and manage all approved doctors in the system
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.push("/dashboard/admin")} // Change "/admin" to your main admin route if different
            className="flex items-center gap-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Admin Dashboard
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Approved Doctors
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {approvedDoctors.length}
                </p>
              </div>
              <Stethoscope className="h-12 w-12 text-green-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-green-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <UserCheck className="w-7 h-7" />
              All Approved Doctors
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-100 border-2 border-dashed rounded-xl h-32"
                  ></div>
                ))}
              </div>
            ) : approvedDoctors.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <p className="text-xl text-gray-600 font-medium">
                  No approved doctors yet
                </p>
                <p className="text-gray-500 mt-2">
                  Approve doctors from the pending requests to see them here.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {approvedDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="group relative bg-emerald-50 border border-green-200 rounded-xl p-6 
                             hover:shadow-xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800">
                          Dr. {doctor.name}
                        </h3>
                        <p className="text-lg text-green-700 font-medium mt-1 flex items-center gap-2">
                          <Stethoscope className="w-5 h-5" />
                          {doctor.specialty || "General Physician"}
                        </p>
                      </div>
                      <div className="bg-green-200 rounded-full p-2">
                        <UserCheck className="w-6 h-6 text-green-700" />
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 text-gray-700">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">{doctor.email}</span>
                      </div>
                      {doctor.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-purple-600" />
                          <span className="text-sm">{doctor.phone}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => deleteDoctor(doctor.id, doctor.name)}
                      disabled={deletingId === doctor.id}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70"
                    >
                      <Trash2 className="w-5 h-5" />
                      {deletingId === doctor.id
                        ? "Deleting..."
                        : "Delete Doctor"}
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
