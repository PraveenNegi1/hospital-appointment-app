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
      (error) => {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const approveDoctor = async (email) => {
    try {
      await updateDoc(doc(db, "doctors", email), { approved: true });
      alert("Doctor approved successfully!");
    } catch (error) {
      alert("Error approving doctor. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-5xl">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Manage doctor registrations and approvals
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Approvals
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-600">
                  {pendingDoctors.length}
                </p>
              </div>
              <Clock className="h-12 w-12 text-orange-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Approved Doctors
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {approvedDoctors.length}
                </p>
              </div>
              <UserCheck className="h-12 w-12 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Doctors
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {pendingDoctors.length + approvedDoctors.length}
                </p>
              </div>
              <Users className="h-12 w-12 text-blue-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Add Doctor Form */}
        <div className="mb-12">
          <AddDoctorForm />
        </div>

        {/* Link to Approved Doctors Management */}
        <div className="mb-12">
          <Link
            href="/dashboard/admin/doctors"
            className="inline-flex items-center gap-3 bg-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl 
                     hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <UserCheck className="w-6 h-6" />
            View All Approved Doctors
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>

        {/* Pending Approvals Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-amber-500 to-orange-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Clock className="w-7 h-7" />
              Pending Doctor Approvals
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-100 border-2 border-dashed rounded-xl h-24"
                  ></div>
                ))}
              </div>
            ) : pendingDoctors.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
                <p className="text-xl text-gray-600 font-medium">
                  No pending doctor requests
                </p>
                <p className="text-gray-500 mt-2">
                  All doctors have been reviewed.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {pendingDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="group relative bg-amber-200 rounded-xl p-6 
                             hover:shadow-xl hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800">
                          {doctor.name}
                        </h4>
                        <p className="text-sm text-amber-700 font-medium mt-1">
                          {doctor.specialty}
                        </p>
                      </div>
                      <div className="bg-amber-200 rounded-full p-2">
                        <Clock className="w-6 h-6 text-amber-700" />
                      </div>
                    </div>

                    <div className="space-y-2 mb-5">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span>{" "}
                        {doctor.email}
                      </p>
                      {doctor.phone && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Phone:</span>{" "}
                          {doctor.phone}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => approveDoctor(doctor.email)}
                      className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg
                               hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200
                               shadow-md hover:shadow-lg"
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
