// app/doctors/[slug]/page.jsx
"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import BookingModal from "@/components/BookingModal";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  GraduationCap,
  Briefcase,
  Stethoscope,
  User,
  ArrowLeft,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function DoctorProfile() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSpecialty = searchParams.get("from");

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchDoctor = async () => {
      const decodedName = decodeURIComponent(slug.replace(/-/g, " "));
      const q = query(
        collection(db, "doctors"),
        where("name", "==", decodedName),
        where("approved", "==", true)
      );

      try {
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data();
          setDoctor({ id: snap.docs[0].id, ...docData });
        } else {
          setDoctor(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [slug]);

  useEffect(() => {
    if (!doctor || !auth.currentUser) return;

    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", auth.currentUser.uid),
      where("doctorName", "==", doctor.name)
    );

    const unsub = onSnapshot(q, (snap) => {
      const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      apps.sort((a, b) => {
        const dateA =
          a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
        const dateB =
          b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
        return dateB - dateA;
      });
      setAppointments(apps);
    });

    return () => unsub();
  }, [doctor]);

  const handleBack = () => {
    if (fromSpecialty) {
      router.push(`/doctor?specialty=${encodeURIComponent(fromSpecialty)}`);
    } else {
      router.push("/doctor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl text-indigo-600">Loading profile...</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center flex-col gap-6">
        <h1 className="text-4xl font-bold text-gray-800">Doctor Not Found</h1>
        <button
          onClick={handleBack}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition flex items-center gap-3"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-8 flex items-center gap-3 text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          <ArrowLeft className="w-6 h-6" />
          Back to {fromSpecialty ? `${fromSpecialty}s` : "All Doctors"}
        </button>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Doctor Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 text-white">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-24 h-24 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold">
                      Dr. {doctor.name}
                    </h1>
                    <p className="text-2xl mt-3 opacity-95">
                      {doctor.specialty}
                    </p>
                    {doctor.fee > 0 && (
                      <p className="text-3xl font-bold mt-6 flex items-center justify-center md:justify-start gap-3">
                        <IndianRupee className="w-8 h-8" /> ₹{doctor.fee}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {doctor.qualifications && (
                    <div className="flex items-start gap-5">
                      <GraduationCap className="w-8 h-8 text-purple-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-600 text-lg">
                          Qualifications
                        </p>
                        <p className="text-gray-800 text-xl">
                          {doctor.qualifications}
                        </p>
                      </div>
                    </div>
                  )}
                  {doctor.experience > 0 && (
                    <div className="flex items-center gap-5">
                      <Briefcase className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-600 text-lg">
                          Experience
                        </p>
                        <p className="text-gray-800 text-xl">
                          {doctor.experience} years
                        </p>
                      </div>
                    </div>
                  )}
                  {doctor.clinicName && (
                    <div className="flex items-center gap-5">
                      <Stethoscope className="w-8 h-8 text-indigo-600" />
                      <div>
                        <p className="font-semibold text-gray-600 text-lg">
                          Clinic
                        </p>
                        <p className="text-gray-800 text-xl">
                          {doctor.clinicName}
                        </p>
                      </div>
                    </div>
                  )}
                  {doctor.address && (
                    <div className="flex items-start gap-5">
                      <MapPin className="w-8 h-8 text-orange-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-600 text-lg">
                          Address
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {doctor.address}
                        </p>
                      </div>
                    </div>
                  )}
                  {doctor.phone && (
                    <div className="flex items-center gap-5">
                      <Phone className="w-8 h-8 text-indigo-600" />
                      <div>
                        <p className="font-semibold text-gray-600 text-lg">
                          Contact
                        </p>
                        <p className="text-gray-800 text-xl">{doctor.phone}</p>
                      </div>
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center gap-5">
                      <Mail className="w-8 h-8 text-indigo-600" />
                      <div>
                        <p className="font-semibold text-gray-600 text-lg">
                          Email
                        </p>
                        <p className="text-gray-800 text-xl">{doctor.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                {doctor.bio && (
                  <div className="pt-8 border-t">
                    <p className="font-semibold text-gray-600 text-lg mb-4">
                      About Doctor
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {doctor.bio}
                    </p>
                  </div>
                )}

                <div className="pt-8 text-center">
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="inline-flex items-center gap-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-2xl py-6 px-16 rounded-3xl shadow-2xl transition transform hover:scale-105"
                  >
                    <Calendar className="w-9 h-9" />
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment History */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Calendar className="w-10 h-10 text-purple-600" />
              Your Appointments
            </h2>

            {appointments.length === 0 ? (
              <div className="bg-white/80 backdrop-blur rounded-3xl p-10 text-center shadow-xl border border-gray-200">
                <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <p className="text-xl text-gray-600">No appointments yet</p>
                <p className="text-gray-500 mt-2">
                  Book your first visit above!
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {appointments.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-lg">
                          {format(
                            app.date instanceof Timestamp
                              ? app.date.toDate()
                              : new Date(app.date),
                            "PPP"
                          )}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                          <Clock className="w-5 h-5" />
                          {app.time || "Time not set"}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          app.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : app.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : app.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.status || "Pending"}
                      </span>
                    </div>
                    <p className="text-gray-700 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        {app.reason || "General checkup"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {selectedDoctor && (
          <BookingModal
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
          />
        )}
      </div>
    </div>
  );
}
