"use client";

import {
  CheckCircle,
  Users,
  Calendar,
  Stethoscope,
  Heart,
  Shield,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen font-serif">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl  font-extrabold mb-6 leading-tight">
            Transforming Healthcare Access
            <br />
            <span className="text-white">One Appointment at a Time</span>
          </h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto opacity-95 leading-relaxed">
            We are a next-generation digital healthcare platform dedicated to
            making quality medical care simple, fast, and accessible for
            everyone — connecting patients with trusted doctors seamlessly.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Who We Are
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              We are a patient-first digital healthcare platform built on trust,
              technology, and empathy. Founded with the vision of eliminating
              long waiting times and complex booking processes, we empower
              patients to take control of their health journey.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              By partnering with verified doctors and clinics across
              specialties, we ensure that quality care is just a few clicks away
              — whether you're at home, work, or on the go.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-indigo-600" />
                <span className="font-medium">HIPAA Compliant & Secure</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-pink-600" />
                <span className="font-medium">Patient-Centered Care</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl bg-white">
              <Image
                src="/aboutherbanner.svg"
                alt="Modern Digital Healthcare Platform - Online Appointment Booking"
                fill
                priority
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl  font-bold text-gray-900">
              Our Mission
            </h2>
            <p className="mt-4 text-xl text-gray-700 max-w-4xl mx-auto">
              To democratize healthcare by building a seamless, secure, and
              intuitive platform that connects patients with the right doctor at
              the right time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Calendar,
                title: "Instant Booking",
                desc: "Book appointments in under 60 seconds with real-time availability",
              },
              {
                icon: Users,
                title: "Verified Doctors",
                desc: "Every doctor is thoroughly vetted and licensed",
              },
              {
                icon: Stethoscope,
                title: "Wide Specialties",
                desc: "Access specialists across 20+ medical fields",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h2 className="text-3xl  font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              number: "01",
              title: "Search Doctor",
              desc: "Find specialists by name, specialty, or location",
            },
            {
              number: "02",
              title: "Check Availability",
              desc: "View real-time slots and doctor profiles",
            },
            {
              number: "03",
              title: "Book Instantly",
              desc: "Secure your appointment in just a few clicks",
            },
            {
              number: "04",
              title: "Get Care",
              desc: "Attend in-person or via teleconsultation",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="relative bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mt-8 mb-3 group-hover:text-indigo-600 transition">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.desc}</p>
              {i < 3 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-6 text-indigo-300 w-10 h-10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16 md:py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {[
            { value: "50K+", label: "Happy Patients" },
            { value: "2K+", label: "Verified Doctors" },
            { value: "25+", label: "Medical Specialties" },
            { value: "4.9/5", label: "Patient Rating" },
          ].map((stat, i) => (
            <div key={i}>
              <h3 className="text-4xl md:text-5xl font-extrabold mb-2">
                {stat.value}
              </h3>
              <p className="text-lg opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Illustration */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Heading & Description */}
          <div className="text-center mb-12">
            <h2 className="text-3xl  font-bold text-gray-900 mb-6">
              Trusted by Patients & Doctors Nationwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join over 50,000 happy patients and 2,000+ verified doctors who
              rely on our platform for seamless, reliable, and stress-free
              healthcare experiences every day.
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-md">
              <p className="text-gray-700 italic mb-6">
                "Booking appointments used to take hours of phone calls. Now
                it's done in seconds — incredibly convenient!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full"></div>
                <div>
                  <p className="font-semibold">Sarah M.</p>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow-md">
              <p className="text-gray-700 italic mb-6">
                "The platform streamlines my schedule and helps me reach more
                patients without the administrative hassle."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full"></div>
                <div>
                  <p className="font-semibold">Dr. Rajesh Kumar</p>
                  <p className="text-sm text-gray-500">Cardiologist</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow-md">
              <p className="text-gray-700 italic mb-6">
                "Secure, easy to use, and always reliable. It's transformed how
                I manage my family's health appointments."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full"></div>
                <div>
                  <p className="font-semibold">Priya S.</p>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </div>
          </div>

          {/* Optional subtle CTA */}
          <div className="text-center mt-6">
            <p className="text-lg text-gray-600">
              Ready to experience the difference?
            </p>
          </div>
        </div>
      </section>
      {/* Vision & Closing */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl  font-bold text-gray-900 mb-6">
            Our Vision
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            A world where no one delays medical care due to complexity or
            inconvenience. We envision a healthcare ecosystem that is
            digital-first, patient-empowered, and universally accessible.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center ">
            <Link href="/doctors" className="inline-block">
              <button className="bg-indigo-600 cursor-pointer text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition shadow-lg w-full sm:w-auto">
                Find a Doctor Now
              </button>
            </Link>
            <Link href="/auth/doctor-signup" className="inline-block">
              <button className="border-2 border-indigo-600 text-indigo-600 cursor-pointer px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition w-full sm:w-auto">
                For Doctors → Join Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
