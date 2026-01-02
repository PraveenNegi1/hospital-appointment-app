"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ================= Hero Section ================= */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            About Us
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Making healthcare appointments simple, fast, and accessible for
            everyone.
          </p>
        </div>
      </section>

      {/* ================= Who We Are ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Who We Are
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
              We are a digital healthcare platform focused on connecting
              patients with trusted medical professionals. Our goal is to
              remove unnecessary barriers in healthcare access through
              technology.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Whether it’s finding the right specialist or booking an
              appointment instantly, we make healthcare convenient and
              reliable.
            </p>
          </div>

          {/* Responsive Image */}
          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-xl bg-white">
            <Image
              src="/aboutherbanner.svg"
              alt="Healthcare Platform"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* ================= Mission ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Our Mission
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Our mission is to bridge the gap between patients and healthcare
              professionals by providing a seamless online appointment booking
              system that saves time and improves care access.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <ul className="space-y-4 text-gray-700 text-base md:text-lg">
              <li>✔ Easy doctor appointment booking</li>
              <li>✔ Verified healthcare professionals</li>
              <li>✔ Secure patient data</li>
              <li>✔ Faster access to medical services</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= How It Works ================= */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StepCard number="01" title="Search Doctor" />
            <StepCard number="02" title="Choose Slot" />
            <StepCard number="03" title="Book Appointment" />
            <StepCard number="04" title="Consult & Care" />
          </div>
        </div>
      </section>

      {/* ================= Stats ================= */}
      <section className="bg-indigo-600 py-12 md:py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <Stat value="10k+" label="Patients Served" />
          <Stat value="1k+" label="Verified Doctors" />
          <Stat value="20+" label="Specialties" />
          <Stat value="99%" label="Patient Satisfaction" />
        </div>
      </section>

      {/* ================= Doctors Banner ================= */}
      <section className="bg-gray-100 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            Trusted by Doctors & Patients
          </h2>

          <div className="relative w-full aspect-[3/2] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-xl bg-white">
            <Image
              src="/undraw_doctors_djoj.svg"
              alt="Doctors Illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            Our Vision
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            To become a trusted digital healthcare platform that empowers
            patients and doctors by simplifying appointment management and
            improving healthcare accessibility across communities.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ================= Components ================= */

function StepCard({ number, title }) {
  return (
    <div className="bg-gray-50 p-6 md:p-8 rounded-2xl shadow text-center hover:shadow-lg transition">
      <span className="text-indigo-600 font-bold text-2xl">
        {number}
      </span>
      <h3 className="text-lg md:text-xl font-semibold mt-3">
        {title}
      </h3>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <h3 className="text-3xl md:text-4xl font-extrabold">
        {value}
      </h3>
      <p className="text-sm md:text-lg mt-2 opacity-90">
        {label}
      </p>
    </div>
  );
}
