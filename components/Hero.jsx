"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function HospitalHero() {
  return (
    <section className="bg-gray-50 py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* ================= Left Content ================= */}
        <div>
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            Trusted Healthcare Since 2010
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Caring for Life, <br className="hidden sm:block" /> Healing with Heart
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl">
            Advanced medical care delivered by experienced doctors using
            modern facilities, compassionate treatment, and patient-first
            approach.
          </p>

          {/* Features */}
          <ul className="mt-6 space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <CheckCircle className="text-blue-600 w-5 h-5" />
              24/7 Emergency & Critical Care
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-blue-600 w-5 h-5" />
              Experienced & Certified Doctors
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-blue-600 w-5 h-5" />
              Modern Diagnostic & Treatment Facilities
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Book Appointment
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              Contact Us
            </button>
          </div>

          {/* Trust Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6 text-center sm:text-left">
            <Stat value="25+" label="Departments" />
            <Stat value="100+" label="Doctors" />
            <Stat value="50k+" label="Patients Treated" />
          </div>
        </div>

        {/* ================= Right Image ================= */}
        <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden shadow-xl">
          <Image
            src="/herobanner.jpg"
            alt="Hospital Facility"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/* ================= Small Component ================= */

function Stat({ value, label }) {
  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
        {value}
      </h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
