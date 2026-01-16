// app/services/[slug]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { servicesData } from "@/app/(public)/services/data";
import {
  Stethoscope,
  ArrowLeft,
  User,
  Briefcase,
  IndianRupee,
  Eye,
  CheckCircle,
} from "lucide-react";

export default function ServiceDoctorsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-100 via-white to-gray-50">
        <div className="text-center p-8 rounded-xl shadow-lg bg-white/90 backdrop-blur-md">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Service Not Found
          </h1>
          <button
            onClick={() => router.push("/services")}
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const specialtyTitle = service.title;
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "doctors"),
      where("approved", "==", true),
      where("specialty", "==", specialtyTitle)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctors(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [specialtyTitle]);

  const handleViewDoctor = (doctor) => {
    const doctorSlug = doctor.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+|-+$/g, "");
    router.push(`/doctors/${doctorSlug}?from=${slug}`);
  };

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-indigo-300 via-purple-400 to-pink-300 rounded-full mb-8 shadow-xl transform hover:scale-105 transition-all duration-500">
            <Icon className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 animate-fadeIn">
            {service.title}
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto animate-fadeIn delay-200">
            {service.shortDesc}
          </p>

          <div className="mt-12 flex justify-center gap-6 flex-wrap">
            <button
              onClick={() => router.push("/services")}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:shadow-2xl transition text-indigo-600 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              All Services
            </button>
            <button
              onClick={() => router.push("/doctors")}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:shadow-2xl transition text-indigo-600 font-medium"
            >
              <Stethoscope className="w-5 h-5" />
              All Doctors
            </button>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 hover:scale-[1.01] transition-transform duration-500">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Overview
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {service.content.overview}
          </p>
        </div>
      </section>

      {/* Treatments & Facilities */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 mb-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 hover:scale-[1.02] transition-transform duration-500">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Treatments Offered
          </h3>
          <ul className="space-y-4">
            {service.content.treatments.map((t, i) => (
              <li key={i} className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5" />
                <span className="text-lg text-gray-700">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 hover:scale-[1.02] transition-transform duration-500">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Facilities Available
          </h3>
          <ul className="space-y-4">
            {service.content.facilities.map((f, i) => (
              <li key={i} className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-indigo-600 mt-0.5" />
                <span className="text-lg text-gray-700">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Meet Our {service.title} Specialists
          </h2>
          <p className="text-xl text-gray-600 mt-4">
            {doctors.length > 0
              ? `We have ${doctors.length} verified specialist${
                  doctors.length > 1 ? "s" : ""
                } ready to help you`
              : "We're continuously adding trusted specialists"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-t-4 border-indigo-600"></div>
            <p className="mt-6 text-lg text-gray-600">Loading specialists...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-32 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200">
            <User className="w-32 h-32 text-gray-300 mx-auto mb-8" />
            <p className="text-3xl font-semibold text-gray-600">
              No {service.title} specialists available
            </p>
            <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
              We are actively onboarding verified doctors in this specialty.
              Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => handleViewDoctor(doctor)}
                className="group bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border border-gray-200 cursor-pointer hover:scale-[1.03]"
              >
                <div className="h-56 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 relative flex items-center justify-center overflow-hidden">
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
                        <IndianRupee className="w-6 h-6" />₹{doctor.fee}
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
      </section>

      {/* FAQs */}
      {service.content.faqs?.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {service.content.faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:scale-[1.02] transition-transform duration-500"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {faq.q}
                </h3>
                <p className="text-gray-600 text-lg">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
