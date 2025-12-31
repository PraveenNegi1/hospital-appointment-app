// app/doctors/page.jsx
"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Briefcase,
  IndianRupee,
  Eye,
  Stethoscope,
  ArrowLeft,
} from "lucide-react";

// Force dynamic rendering to avoid build errors with search params

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const specialty = searchParams.get("specialty");

  useEffect(() => {
    let baseQuery = query(
      collection(db, "doctors"),
      where("approved", "==", true)
    );

    if (specialty) {
      baseQuery = query(
        collection(db, "doctors"),
        where("approved", "==", true),
        where("specialty", "==", specialty)
      );
    }

    const unsub = onSnapshot(baseQuery, (snap) => {
      setDoctors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [specialty]);

  const handleViewDoctor = (doctor) => {
    const slug = doctor.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+|-+$/g, ""); // clean leading/trailing dashes

    const url = specialty
      ? `/doctors/${slug}?from=${encodeURIComponent(specialty)}`
      : `/doctors/${slug}`;

    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 flex items-center justify-center gap-4 mb-4">
            <Stethoscope className="w-14 h-14 text-indigo-600" />
            {specialty ? `${specialty}s` : "All Doctors"}
          </h1>
          <p className="text-xl text-gray-600">
            {specialty
              ? `Expert ${specialty}s ready to help you`
              : "Browse our verified and trusted medical professionals"}
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur rounded-full shadow-md hover:shadow-lg transition text-indigo-600 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {doctors.length === 0 ? (
          <div className="text-center py-32 bg-white/80 backdrop-blur rounded-3xl shadow-2xl border border-gray-200">
            <User className="w-32 h-32 text-gray-300 mx-auto mb-8" />
            <p className="text-3xl font-semibold text-gray-600">
              {specialty
                ? `No ${specialty}s available at the moment`
                : "No approved doctors yet"}
            </p>
            <p className="text-lg text-gray-500 mt-4">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="group bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 cursor-pointer"
                onClick={() => handleViewDoctor(doctor)}
              >
                <div className="h-52 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/20" />
                  <User className="w-28 h-28 text-white/90 z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-2xl font-bold">Dr. {doctor.name}</h3>
                    <p className="text-lg opacity-95">{doctor.specialty}</p>
                  </div>
                </div>

                <div className="p-6 text-center">
                  <div className="space-y-3 mb-6">
                    {doctor.experience > 0 && (
                      <div className="flex items-center justify-center gap-2 text-gray-700">
                        <Briefcase className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium">
                          {doctor.experience} years experience
                        </span>
                      </div>
                    )}
                    {doctor.fee > 0 && (
                      <div className="text-2xl font-bold text-emerald-700 flex items-center justify-center gap-2">
                        <IndianRupee className="w-7 h-7" />₹{doctor.fee}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDoctor(doctor);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-3"
                  >
                    <Eye className="w-6 h-6" />
                    View Full Profile
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