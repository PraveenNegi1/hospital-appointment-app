// app/my-appointments/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// 1. Add to tailwind.config.js  →  theme.extend:
//
//   fontFamily: {
//     serif: ['"Playfair Display"', 'Georgia', 'serif'],
//     sans:  ['"DM Sans"', 'sans-serif'],
//   },
//   keyframes: {
//     cardFadeIn: {
//       '0%':   { opacity: '0', transform: 'translateY(16px)' },
//       '100%': { opacity: '1', transform: 'translateY(0)'    },
//     },
//     spinReverse: { to: { transform: 'rotate(-360deg)' } },
//   },
//   animation: {
//     'card-in':      'cardFadeIn 0.4s ease both',
//     'spin-reverse': 'spinReverse 1.4s linear infinite',
//   },
//
// 2. Add to globals.css:
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged-in Patient UID:", user.uid);
        const unsubscribeQuery = fetchUserAppointments(user.uid);
        return () => unsubscribeQuery();
      } else {
        setError("Please sign in to view your appointments");
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const fetchUserAppointments = (patientUid) => {
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", patientUid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(`Patient UID: ${patientUid} | Loaded ${data.length} appointments`);
        setAppointments(data);
        setLoading(false);
      },
      (err) => {
        console.error("Appointments fetch error:", err);
        setError(err.message || "Failed to load your appointments");
        setLoading(false);
      },
    );

    return unsubscribe;
  };

  const getStatusBadge = (status) => {
    const lower = (status || "pending").toLowerCase();
    const styles = {
      pending:   "bg-amber-100 text-amber-800 border-amber-300",
      confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
      rejected:  "bg-rose-100 text-rose-800 border-rose-300",
      cancelled: "bg-rose-100 text-rose-800 border-rose-300",
      completed: "bg-sky-100 text-sky-800 border-sky-300",
    };
    const chosen = styles[lower] || "bg-gray-100 text-gray-700 border-gray-300";
    return {
      className: `inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${chosen}`,
      text: lower.charAt(0).toUpperCase() + lower.slice(1),
    };
  };

  const STATS = (appts) => [
    { label: "Total",     value: appts.length,                                                          color: "text-indigo-600",  dot: "bg-indigo-500"  },
    { label: "Pending",   value: appts.filter(a => a.status?.toLowerCase() === "pending").length,    color: "text-amber-500",   dot: "bg-amber-400"   },
    { label: "Confirmed", value: appts.filter(a => a.status?.toLowerCase() === "confirmed").length,  color: "text-emerald-600", dot: "bg-emerald-500" },
    { label: "Completed", value: appts.filter(a => a.status?.toLowerCase() === "completed").length,  color: "text-sky-600",     dot: "bg-sky-500"     },
  ];

  return (
    /* ─── Root ─── */
    <div className="font-sans min-h-screen bg-[#f7f8fc] relative overflow-x-hidden pb-20 pt-12 px-6 sm:px-8">

      {/* Ambient background blobs */}
      <div
        className="pointer-events-none fixed -top-[30%] -right-[20%] w-[700px] h-[700px] rounded-full z-0"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed -bottom-[20%] -left-[15%] w-[600px] h-[600px] rounded-full z-0"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)" }}
      />

      {/* ─── Inner container ─── */}
      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ─── Page Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12">

          {/* Title */}
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-500 mb-2">
              <span className="inline-block w-6 h-0.5 bg-indigo-500 rounded" />
              Health Dashboard
            </p>
            <h1 className="font-serif text-[clamp(28px,5vw,44px)] font-bold text-gray-900 leading-tight tracking-tight mb-2">
              My Appointments
            </h1>
            <p className="text-base text-gray-500">
              Track and manage all your booked consultations
            </p>
          </div>

          {/* CTA button */}
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-sm font-semibold tracking-wide px-6 py-3.5 rounded-2xl shadow-[0_4px_16px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_28px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Book Appointment
          </Link>
        </div>

        {/* ─── Stats Bar ─── */}
        {!loading && !error && appointments.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-9">
            {STATS(appointments).map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex flex-col gap-1 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] uppercase text-gray-400">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${stat.dot}`} />
                  {stat.label}
                </div>
                <div className={`font-serif text-[26px] font-bold leading-none ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Loading ─── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-[3px] border-gray-200" />
              <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-600 animate-spin" />
              <div className="absolute inset-[10px] rounded-full border-2 border-transparent border-t-indigo-300 animate-spin-reverse" />
            </div>
            <p className="text-base font-medium text-gray-500 tracking-wide">
              Loading your appointments…
            </p>
          </div>
        )}

        {/* ─── Error State ─── */}
        {error && !loading && (
          <div className="bg-white rounded-3xl border border-rose-200 shadow-[0_8px_40px_rgba(239,68,68,0.07)] max-w-lg mx-auto px-10 py-14 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mx-auto mb-5 ring-[12px] ring-red-50">
              <AlertCircle className="w-9 h-9 text-red-500" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2.5">
              Something went wrong
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold text-sm px-8 py-3.5 rounded-2xl shadow-[0_4px_16px_rgba(239,68,68,0.3)] hover:shadow-[0_8px_24px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ─── Empty State ─── */}
        {!loading && !error && appointments.length === 0 && (
          <div className="relative overflow-hidden bg-white rounded-[28px] border border-gray-200 shadow-[0_8px_40px_rgba(99,102,241,0.07)] max-w-lg mx-auto px-10 py-16 text-center">
            <div
              className="pointer-events-none absolute -top-[40%] -right-[20%] w-72 h-72 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }}
            />
            <div className="relative z-10">
              <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center mx-auto mb-6 ring-[16px] ring-indigo-50/60">
                <CalendarDays className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="font-serif text-[28px] font-bold text-gray-900 mb-3">
                No appointments yet
              </h3>
              <p className="text-gray-500 text-base leading-[1.7] mb-9">
                Start by finding a doctor and booking your first consultation —
                it will appear here.
              </p>
              <Link href="/doctors">
                <button className="inline-flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-semibold text-sm px-8 py-3.5 rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_10px_32px_rgba(99,102,241,0.42)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Find a Doctor Now
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* ─── Appointment Cards ─── */}
        {!loading && !error && appointments.length > 0 && (
          <>
            {/* Count divider */}
            <div className="flex items-center gap-3 mb-5 text-[13px] font-medium text-gray-400 tracking-[0.04em]">
              <span className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
              {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
              <span className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
            </div>

            <div className="flex flex-col gap-6">
              {appointments.map((appt, i) => {
                const statusInfo = getStatusBadge(appt.status);

                return (
                  <div
                    key={appt.id}
                    style={{ animationDelay: `${0.05 + i * 0.05}s` }}
                    className="bg-white rounded-3xl border border-gray-100/80 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_48px_rgba(99,102,241,0.12)] hover:-translate-y-1 transition-all duration-300 animate-card-in"
                  >

                    {/* ── Card Header ── */}
                    <div className="relative overflow-hidden px-7 py-6 bg-gradient-to-br from-indigo-900 via-indigo-600 to-indigo-400">
                      {/* Decorative glows */}
                      <div
                        className="pointer-events-none absolute -top-1/2 -right-[10%] w-64 h-64 rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)" }}
                      />
                      <div
                        className="pointer-events-none absolute -bottom-[30%] -left-[5%] w-44 h-44 rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)" }}
                      />

                      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-indigo-200 mb-1.5">
                            {appt.specialty || "Specialist"}
                          </p>
                          <h3 className="font-serif text-[clamp(18px,3vw,24px)] font-bold text-white leading-snug tracking-tight mb-3">
                            Dr. {appt.doctorName || "Doctor"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-medium text-white/90">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {appt.date}
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-medium text-white/90">
                              <Clock className="w-3.5 h-3.5" />
                              {appt.time}
                            </span>
                          </div>
                        </div>

                        {/* Status badge with white background override */}
                        <span className={`${statusInfo.className} !bg-white/95 self-start flex-shrink-0 shadow-md`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>

                    {/* ── Card Body ── */}
                    <div className="px-7 py-6 space-y-5">

                      {/* Info grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* Patient */}
                        <div className="flex items-start gap-3 bg-gray-50 hover:bg-indigo-50/60 border border-gray-100 hover:border-indigo-100 rounded-2xl px-4 py-3.5 transition-colors duration-200">
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-0.5">
                              Patient
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                              {appt.patientAge || "?"} yrs • {appt.patientGender || "—"}
                            </div>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-3 bg-gray-50 hover:bg-indigo-50/60 border border-gray-100 hover:border-indigo-100 rounded-2xl px-4 py-3.5 transition-colors duration-200">
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-0.5">
                              Phone
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                              {appt.patientPhone || "—"}
                            </div>
                          </div>
                        </div>

                        {/* Booked On */}
                        <div className="flex items-start gap-3 bg-gray-50 hover:bg-indigo-50/60 border border-gray-100 hover:border-indigo-100 rounded-2xl px-4 py-3.5 transition-colors duration-200">
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <CalendarDays className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-0.5">
                              Booked On
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                              {appt.createdAt?.toDate
                                ? appt.createdAt.toDate().toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })
                                : "—"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reason for visit */}
                      <div className="pt-4 border-t border-dashed border-gray-200">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">
                          Reason for Visit
                          <span className="flex-1 h-px bg-gray-100" />
                        </div>
                        <p className="text-[14.5px] text-gray-600 leading-[1.7] italic px-4 py-3 bg-gradient-to-br from-slate-50 to-indigo-50/60 border-l-[3px] border-indigo-200 rounded-xl">
                          {appt.reason || "Not specified"}
                        </p>
                      </div>

                      {/* Address */}
                      {appt.patientAddress && (
                        <div className="pt-4 border-t border-dashed border-gray-200">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">
                            Address
                            <span className="flex-1 h-px bg-gray-100" />
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-3.5 py-2.5 leading-relaxed">
                            <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                            {appt.patientAddress}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── Card Footer / Actions ── */}
                    {appt.status?.toLowerCase() === "pending" && (
                      <div className="px-7 pb-5 pt-3 bg-indigo-50/40 border-t border-gray-100 flex gap-3">
                        <button className="flex-1 bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold text-sm py-3.5 rounded-2xl shadow-[0_3px_12px_rgba(239,68,68,0.25)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 tracking-wide">
                          Cancel Appointment
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}