"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* ---------------- AUTH LISTENER ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  /* ---------------- FETCH DOCTOR ---------------- */
  useEffect(() => {
    if (!slug) return;

    const fetchDoctor = async () => {
      try {
        const decodedName = decodeURIComponent(slug.replace(/-/g, " "));
        const q = query(
          collection(db, "doctors"),
          where("name", "==", decodedName),
          where("approved", "==", true)
        );

        const snap = await getDocs(q);
        if (!snap.empty) {
          setDoctor({ id: snap.docs[0].id, ...snap.docs[0].data() });
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

  /* ---------------- AUTO OPEN MODAL AFTER LOGIN ---------------- */
  useEffect(() => {
    if (!authLoading && user && doctor && bookAfterLogin === "true") {
      setSelectedDoctor(doctor);
      router.replace(`/doctors/${slug}`, { scroll: false });
    }
  }, [authLoading, user, doctor, bookAfterLogin, router, slug]);

  /* ---------------- FETCH APPOINTMENTS (ONLY LOGGED USER) ---------------- */
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

  /* ---------------- HANDLERS ---------------- */
  const handleBack = () => {
    if (fromSpecialty) {
      router.push(`/doctors?specialty=${encodeURIComponent(fromSpecialty)}`);
    } else {
      router.push("/doctors");
    }
  };

  const handleBookAppointment = () => {
    if (!user) {
      router.push(`/login?redirect=/doctors/${slug}&book=true`);
      return;
    }
    setSelectedDoctor(doctor);
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-indigo-600">
        Loading profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Doctor Not Found</h1>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-indigo-600"
        >
          <ArrowLeft /> Back
        </button>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Doctor Info */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-indigo-600 text-white p-8 flex gap-6 items-center">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-20 h-20" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Dr. {doctor.name}</h1>
                <p className="text-xl mt-1">{doctor.specialty}</p>
                {doctor.fee > 0 && (
                  <p className="mt-3 text-2xl flex items-center gap-2">
                    <IndianRupee /> ₹{doctor.fee}
                  </p>
                )}
              </div>
            </div>

            <div className="p-8 space-y-6">
              {doctor.qualifications && (
                <InfoRow
                  icon={<GraduationCap />}
                  label="Qualifications"
                  value={doctor.qualifications}
                />
              )}
              {doctor.experience && (
                <InfoRow
                  icon={<Briefcase />}
                  label="Experience"
                  value={`${doctor.experience} years`}
                />
              )}
              {doctor.clinicName && (
                <InfoRow
                  icon={<Stethoscope />}
                  label="Clinic"
                  value={doctor.clinicName}
                />
              )}
              {doctor.address && (
                <InfoRow
                  icon={<MapPin />}
                  label="Address"
                  value={doctor.address}
                />
              )}
              {doctor.phone && (
                <InfoRow
                  icon={<Phone />}
                  label="Phone"
                  value={doctor.phone}
                />
              )}
              {doctor.email && (
                <InfoRow
                  icon={<Mail />}
                  label="Email"
                  value={doctor.email}
                />
              )}

              <div className="text-center pt-6">
                <button
                  onClick={handleBookAppointment}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-2xl text-xl font-bold flex items-center gap-3 mx-auto"
                >
                  <Calendar /> Book Appointment
                </button>
              </div>
            </div>
          </div>

          {/* Appointment History */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>

            {!user ? (
              <EmptyBox text="Please login to view your appointments" />
            ) : appointments.length === 0 ? (
              <EmptyBox text="No appointments yet" />
            ) : (
              <div className="space-y-4">
                {appointments.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-xl p-4 shadow"
                  >
                    <p className="font-bold">
                      {format(
                        app.date instanceof Timestamp
                          ? app.date.toDate()
                          : new Date(app.date),
                        "PPP"
                      )}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> {app.time}
                    </p>
                    <span className="text-sm font-semibold capitalize">
                      {app.status || "pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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

/* ---------------- SMALL COMPONENTS ---------------- */

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="text-indigo-600">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-lg">{value}</p>
      </div>
    </div>
  );
}

function EmptyBox({ text }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
      <AlertCircle className="mx-auto mb-2 text-gray-400" />
      {text}
    </div>
  );
}
