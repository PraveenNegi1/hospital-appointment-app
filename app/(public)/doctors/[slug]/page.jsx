"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  ArrowLeft,
  User,
  Stethoscope,
  IndianRupee,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

/* ===============================
   Helper: name → slug
================================ */
function nameToSlug(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function DoctorSlugPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSpecialty = searchParams.get("from");

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     Fetch doctor by slug
  ================================ */
  useEffect(() => {
    if (!slug) return;

    const fetchDoctor = async () => {
      try {
        const q = query(
          collection(db, "doctors"),
          where("approved", "==", true)
        );

        const snap = await getDocs(q);

        let found = null;

        snap.docs.forEach((doc) => {
          const data = doc.data();
          const generatedSlug = nameToSlug(data.name);

          if (generatedSlug === slug) {
            found = { id: doc.id, ...data };
          }
        });

        setDoctor(found);
      } catch (err) {
        console.error("Failed to load doctor:", err);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [slug]);

  /* ===============================
     States
  ================================ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading doctor profile…</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Doctor not found</h1>
        <button
          onClick={() => router.push("/doctors")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  /* ===============================
     UI
  ================================ */
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() =>
            fromSpecialty
              ? router.push(`/doctors?specialty=${fromSpecialty}`)
              : router.push("/doctors")
          }
          className="mb-6 flex items-center gap-2 text-indigo-600"
        >
          <ArrowLeft /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white flex gap-6 items-center">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Dr. {doctor.name}</h1>
              <p className="text-xl mt-2">{doctor.specialty}</p>
              {doctor.fee > 0 && (
                <p className="text-2xl font-bold mt-4 flex items-center gap-2">
                  <IndianRupee /> {doctor.fee}
                </p>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-8 grid md:grid-cols-2 gap-6">
            {doctor.experience > 0 && (
              <InfoRow
                icon={<Briefcase className="text-green-600" />}
                label="Experience"
                value={`${doctor.experience} years`}
              />
            )}

            {doctor.qualifications && (
              <InfoRow
                icon={<GraduationCap className="text-purple-600" />}
                label="Qualifications"
                value={doctor.qualifications}
              />
            )}

            {doctor.phone && (
              <InfoRow
                icon={<Phone className="text-indigo-600" />}
                label="Phone"
                value={doctor.phone}
              />
            )}

            {doctor.email && (
              <InfoRow
                icon={<Mail className="text-indigo-600" />}
                label="Email"
                value={doctor.email}
              />
            )}

            {doctor.address && (
              <InfoRow
                icon={<MapPin className="text-orange-600" />}
                label="Address"
                value={doctor.address}
              />
            )}

            {doctor.clinicName && (
              <InfoRow
                icon={<Stethoscope className="text-indigo-600" />}
                label="Clinic"
                value={doctor.clinicName}
              />
            )}
          </div>

          {doctor.bio && (
            <div className="p-8 border-t">
              <h3 className="text-xl font-semibold mb-3">About Doctor</h3>
              <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===============================
   Small reusable row
================================ */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8">{icon}</div>
      <div>
        <p className="font-semibold text-gray-600">{label}</p>
        <p className="text-gray-800">{value}</p>
      </div>
    </div>
  );
}
