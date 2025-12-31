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
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import BookingModal from "@/components/BookingModal";
import { format } from "date-fns";
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
  const bookAfterLogin = searchParams.get("book");

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // Fetch doctor - ROBUST MATCHING
  useEffect(() => {
    if (!slug) return;

    const fetchDoctor = async () => {
      try {
        // Clean and normalize the slug into a searchable name
        let targetName = slug.replace(/-/g, " ").trim();

        const targetLower = targetName.toLowerCase();

        console.log("Searching for doctor with slug:", slug);
        console.log("Target name (normalized):", targetLower);

        // Get all approved doctors
        const q = query(
          collection(db, "doctors"),
          where("approved", "==", true)
        );

        const snap = await getDocs(q);
        let foundDoctor = null;

        snap.docs.forEach((doc) => {
          const data = doc.data();
          const dbName = (data.name || "").trim();
          let dbNameClean = dbName.toLowerCase();

          // Remove common prefixes/suffixes
          dbNameClean = dbNameClean
            .replace(/^dr\.?\s+/i, "") // Remove "Dr." or "Dr "
            .replace(/^dr\s+/i, "")
            .replace(/\s*(md|phd|mbbs|dnb).*$/i, "") // Remove titles
            .trim();

          if (
            dbNameClean === targetLower ||
            dbName.toLowerCase() === targetLower ||
            dbNameClean.includes(targetLower) ||
            targetLower.includes(dbNameClean)
          ) {
            foundDoctor = { id: doc.id, ...data };
            console.log("MATCH FOUND:", dbName, "→", dbNameClean);
          }
        });

        if (foundDoctor) {
          setDoctor(foundDoctor);
          console.log("Doctor loaded successfully:", foundDoctor.name);
        } else {
          console.log("No doctor found matching:", targetLower);
          console.log(
            "Available doctors:",
            snap.docs.map((d) => d.data().name)
          );
          setDoctor(null);
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [slug]);

  // Auto-open modal after login
  useEffect(() => {
    if (user && doctor && bookAfterLogin === "true") {
      setSelectedDoctor(doctor);
      const cleanUrl = fromSpecialty
        ? `/doctors/${slug}?from=${fromSpecialty}`
        : `/doctors/${slug}`;
      router.replace(cleanUrl, { scroll: false });
    }
  }, [user, doctor, bookAfterLogin, slug, fromSpecialty, router]);

  // Fetch appointments only for logged-in user
  useEffect(() => {
    if (!doctor || !user) {
      setAppointments([]);
      return;
    }

    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", user.uid),
      where("doctorName", "==", doctor.name)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => {
        const aDate =
          a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
        const bDate =
          b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
        return bDate - aDate;
      });
      setAppointments(data);
    });

    return () => unsub();
  }, [doctor, user]);

  const handleBack = () => {
    if (fromSpecialty) {
      router.push(`/doctors?specialty=${encodeURIComponent(fromSpecialty)}`);
    } else {
      router.push("/doctors");
    }
  };

  const handleBookAppointment = () => {
    if (!user) {
      const returnUrl = fromSpecialty
        ? `/doctors/${slug}?from=${fromSpecialty}&book=true`
        : `/doctors/${slug}?book=true`;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    } else {
      setSelectedDoctor(doctor);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <p className="text-2xl text-indigo-600">Loading doctor profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <h1 className="text-4xl font-bold text-gray-800">Doctor Not Found</h1>
        <p className="text-gray-600">
          The doctor profile you're looking for doesn't exist or has been
          removed.
        </p>
        <button
          onClick={handleBack}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition flex items-center gap-3"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Doctors
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
          Back to {fromSpecialty ? `${fromSpecialty}s` : "Doctors List"}
        </button>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Doctor Details */}
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
                        <IndianRupee className="w-8 h-8" /> {doctor.fee}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {doctor.qualifications && (
                    <InfoRow
                      icon={
                        <GraduationCap className="w-8 h-8 text-purple-600" />
                      }
                      label="Qualifications"
                      value={doctor.qualifications}
                    />
                  )}
                  {doctor.experience > 0 && (
                    <InfoRow
                      icon={<Briefcase className="w-8 h-8 text-green-600" />}
                      label="Experience"
                      value={`${doctor.experience} years`}
                    />
                  )}
                  {doctor.clinicName && (
                    <InfoRow
                      icon={<Stethoscope className="w-8 h-8 text-indigo-600" />}
                      label="Clinic"
                      value={doctor.clinicName}
                    />
                  )}
                  {doctor.address && (
                    <InfoRow
                      icon={<MapPin className="w-8 h-8 text-orange-600" />}
                      label="Address"
                      value={doctor.address}
                    />
                  )}
                  {doctor.phone && (
                    <InfoRow
                      icon={<Phone className="w-8 h-8 text-indigo-600" />}
                      label="Contact"
                      value={doctor.phone}
                    />
                  )}
                  {doctor.email && (
                    <InfoRow
                      icon={<Mail className="w-8 h-8 text-indigo-600" />}
                      label="Email"
                      value={doctor.email}
                    />
                  )}
                </div>

                {doctor.bio && (
                  <div className="pt-8 border-t border-gray-200">
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
                    onClick={handleBookAppointment}
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

            {!user ? (
              <div className="bg-white/80 backdrop-blur rounded-3xl p-10 text-center shadow-xl border border-gray-200">
                <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <p className="text-xl text-gray-600">
                  Please log in to view your appointments
                </p>
                <button
                  onClick={() =>
                    router.push(
                      `/login?returnUrl=${encodeURIComponent(
                        location.pathname + location.search
                      )}`
                    )
                  }
                  className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                  Log In / Sign Up
                </button>
              </div>
            ) : appointments.length === 0 ? (
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
        {selectedDoctor && user && (
          <BookingModal
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
          />
        )}
      </div>
    </div>
  );
}

// Reusable component
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-5">
      {icon}
      <div>
        <p className="font-semibold text-gray-600 text-lg">{label}</p>
        <p className="text-gray-800 text-xl">{value}</p>
      </div>
    </div>
  );
}
