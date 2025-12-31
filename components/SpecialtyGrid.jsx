// app/components/SpecialtyGrid.jsx
"use client";

import { useRouter } from "next/navigation";
import {
  Stethoscope,
  HeartPulse,
  Baby,
  Brain,
  Bone,
  Eye,
  Smile,
  User,
} from "lucide-react";

const specialties = [
  { name: "General Physician", icon: Stethoscope },
  { name: "Cardiologist", icon: HeartPulse },
  { name: "Dermatologist", icon: Eye },
  { name: "Pediatrician", icon: Baby },
  { name: "Orthopedic", icon: Bone },
  { name: "Neurologist", icon: Brain },
  { name: "Gynecologist", icon: User },
  { name: "Dentist", icon: Smile },
  { name: "Psychiatrist", icon: Brain },
];

export default function SpecialtyGrid() {
  const router = useRouter();

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-4">
          Find Doctors by Specialty
        </h2>
        <p className="text-center text-xl text-gray-600 mb-12">
          Choose a specialty to view our expert doctors
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {specialties.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() =>
                router.push(`/doctor?specialty=${encodeURIComponent(name)}`)
              }
              className="group bg-white/90 backdrop-blur rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100"
            >
              <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                <Icon className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <p className="mt-6 font-bold text-gray-800 text-base sm:text-lg group-hover:text-indigo-700 transition">
                {name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}