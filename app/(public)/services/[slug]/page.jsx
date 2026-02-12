"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { servicesData } from "@/app/(public)/services/data";
import BookingModal from "@/components/BookingModal"; 

import {
  ArrowLeft,
  User,
  Briefcase,
  IndianRupee,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  CalendarDays,
} from "lucide-react";

export default function ServiceDoctorsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const service = servicesData.find((s) => s.slug === slug);

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  useEffect(() => {
    if (!slug) return;

    const q = query(
      collection(db, "doctors"),
      where("status", "==", "approved"),
      where("specialty", "==", slug.toLowerCase()),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(docs);
      setLoading(false);
    });

    return () => unsub();
  }, [slug]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Service Not Found
      </div>
    );
  }

  const Icon = service.icon;

  const handleBookAppointment = (doctor) => {
    openModal(doctor); // ✅ Open modal instead of routing
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-serif">
      {/* HERO */}
      <section className="py-20 text-center">
        <Icon className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
        <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {service.shortDesc}
        </p>
      </section>

      {/* SERVICE FULL CONTENT */}
      <section className="max-w-6xl mx-auto px-4 pb-20 space-y-16">
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            {service.content?.overview}
          </p>
        </div>

        {service.content?.treatments && (
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Treatments & Services</h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {service.content.treatments.map((item, index) => (
                <li key={index} className="bg-indigo-50 p-4 rounded-xl">
                  ✔ {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.content?.facilities && (
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Facilities</h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {service.content.facilities.map((item, index) => (
                <li key={index} className="bg-purple-50 p-4 rounded-xl">
                  ✔ {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.content?.doctors && (
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">
              Our {service.title} Specialists
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {service.content.doctors.map((doc, index) => (
                <li key={index} className="bg-pink-50 p-4 rounded-xl">
                  👨‍⚕️ {doc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.content?.faqs && (
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {service.content.faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-lg">{faq.q}</h3>
                  <p className="text-gray-600 mt-2">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* FIRESTORE DOCTORS */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Available Doctors
        </h2>

        {loading ? (
          <div className="text-center">Loading doctors...</div>
        ) : doctors.length === 0 ? (
          <div className="text-center text-gray-500">
            No doctors available for this service.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-3xl shadow-xl p-8 border hover:shadow-2xl transition"
              >
                <div className="text-center mb-6">
                  <User className="w-16 h-16 mx-auto text-indigo-600 mb-3" />
                  <h3 className="text-xl font-bold">Dr. {doctor.fullName}</h3>
                  <p className="text-indigo-600 capitalize">
                    {doctor.specialty}
                  </p>
                </div>

                <div className="space-y-3 text-gray-700 text-sm">
                  {doctor.bio && (
                    <div className="bg-indigo-50 p-3 rounded-xl text-gray-600">
                      {doctor.bio}
                    </div>
                  )}

                  {doctor.qualification && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {doctor.qualification}
                    </div>
                  )}

                  {doctor.experienceYears && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {doctor.experienceYears} Years Experience
                    </div>
                  )}

                  {doctor.consultationFee && (
                    <div className="flex items-center gap-2 font-semibold text-emerald-700">
                      <IndianRupee className="w-4 h-4" />₹
                      {doctor.consultationFee}
                    </div>
                  )}

                  {doctor.clinicName && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {doctor.clinicName}
                    </div>
                  )}

                  {doctor.clinicAddress && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {doctor.clinicAddress}
                    </div>
                  )}

                  {doctor.availability && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      {doctor.availability}
                    </div>
                  )}

                  {doctor.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {doctor.phoneNumber}
                    </div>
                  )}

                  {doctor.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {doctor.email}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleBookAppointment(doctor)}
                  className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
                >
                  📅 Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ BOOKING MODAL */}
      {isModalOpen && selectedDoctor && (
        <BookingModal
          doctor={{
            ...selectedDoctor,
            uid: selectedDoctor.id,
          }}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
