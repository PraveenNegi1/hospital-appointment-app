// app/doctors/page.jsx
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  User,
  Stethoscope,
  Briefcase,
  IndianRupee,
  Eye,
} from "lucide-react";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "doctors"), where("approved", "==", true)),
      (snap) => {
        setDoctors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );
    return () => unsub();
  }, []);

  const handleViewDoctor = (doctor) => {
    const slug = doctor.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
    router.push(`/doctors/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-indigo-100 shadow-sm">
              <Stethoscope className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Our Expert Doctors
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Meet our verified specialists committed to providing exceptional
            healthcare services
          </p>
        </div>

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <div className="text-center py-32 bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-gray-200">
            <User className="w-28 h-28 text-gray-300 mx-auto mb-8" />
            <p className="text-2xl font-semibold text-gray-600">
              No approved doctors available at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => handleViewDoctor(doctor)}
                className="group relative bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-1"
              >
                {/* Avatar */}
                <div className="pt-10 pb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 blur-md opacity-30" />
                    <div className="relative w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center ring-4 ring-white shadow-lg">
                      <User className="w-14 h-14 text-indigo-600" />
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 pb-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900">
                    Dr. {doctor.name}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {doctor.specialty}
                  </p>

                  <div className="mt-5 space-y-3">
                    {doctor.experience > 0 && (
                      <div className="flex justify-center items-center gap-2 text-sm text-gray-700">
                        <Briefcase className="w-5 h-5 text-emerald-600" />
                        {doctor.experience} years experience
                      </div>
                    )}
                    {doctor.fee > 0 && (
                      <div className="flex justify-center items-center gap-2 text-lg font-bold text-emerald-700">
                        <IndianRupee className="w-6 h-6" />
                        {doctor.fee}
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDoctor(doctor);
                    }}
                    className="mt-8 w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-xl transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
