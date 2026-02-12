"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DoctorSidebar from "@/components/DoctorSidebar";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function DoctorDashboard() {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const router = useRouter();
  const [newAppointmentsCount, setNewAppointmentsCount] = useState(0);

  const fetchDoctorData = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    try {
      const doctorRef = doc(db, "doctors", currentUser.uid);
      const doctorSnap = await getDoc(doctorRef);

      if (doctorSnap.exists()) {
        setDoctorData(doctorSnap.data());
      } else {
        setError(
          "Your doctor profile not found. Please complete your profile first.",
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load your profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [router]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", user.uid),
      where("status", "==", "pending"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNewAppointmentsCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  const handleRequestApproval = async () => {
    if (!confirm("Send approval request to admin?")) return;

    setRequestLoading(true);
    setRequestSuccess(false);
    setRequestError(null);

    try {
      const user = auth.currentUser;
      const docRef = doc(db, "doctors", user.uid);

      await updateDoc(docRef, {
        status: "pending-review",
        approvalRequestedAt: new Date().toISOString(),
        approvalRequestedBy: user.uid,
        rejectionReason: "", // clear previous rejection reason if any
      });

      setRequestSuccess(true);
      setDoctorData((prev) => ({
        ...prev,
        status: "pending-review",
      }));
      alert("Approval request sent successfully!");
    } catch (err) {
      console.error("Request failed:", err);
      setRequestError("Failed to send request. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen font-serif bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            href="/dashboard/doctor/edit-profile"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Complete Your Profile
          </Link>
        </div>
      </div>
    );
  }

  const status = doctorData?.status || "pending";
  const isPending = status === "pending" || status === "pending-review";
  const isRejected = status === "rejected";
  const isApproved = status === "approved";

  return (
    <div className="min-h-screen bg-gray-50 flex font-serif">
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Main content */}
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome, Dr. {doctorData?.fullName?.split(" ").pop() || "Doctor"}
            </h1>

            {/* Approval Request / Re-request Button */}
            {(isPending || isRejected) && (
              <button
                onClick={handleRequestApproval}
                disabled={requestLoading || requestSuccess}
                className={`mt-4 md:mt-0 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center gap-2 ${
                  requestLoading
                    ? "bg-yellow-500 cursor-not-allowed"
                    : requestSuccess
                      ? "bg-green-600 cursor-not-allowed"
                      : isRejected
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800"
                }`}
              >
                {requestLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        className="opacity-75"
                      />
                    </svg>
                    Sending...
                  </>
                ) : requestSuccess ? (
                  "Request Sent ✓"
                ) : isRejected ? (
                  "Send Approval Request Again"
                ) : (
                  "Request Approval from Admin"
                )}
              </button>
            )}
          </div>

          {/* Status Banner */}
          <div
            className={`mb-8 p-5 rounded-xl border shadow-sm ${
              isApproved
                ? "bg-green-50 border-green-200 text-green-800"
                : isRejected
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-yellow-50 border-yellow-200 text-yellow-800"
            }`}
          >
            <p className="font-medium text-lg">
              {isApproved
                ? "Your profile is approved and visible to patients."
                : isRejected
                  ? "Your profile was rejected by admin. You can request approval again."
                  : "Your profile is pending approval. Once approved, patients can find and book you."}
            </p>

            {isRejected && doctorData?.rejectionReason && (
              <p className="mt-3 text-red-700">
                <strong>Reason from admin:</strong> {doctorData.rejectionReason}
              </p>
            )}
          </div>

          {/* Profile Details Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold">
                Dr. {doctorData?.fullName?.split(" ").pop() || "Doctor"}
              </h2>
              <p className="mt-2 text-indigo-100 text-lg">
                {doctorData?.specialty || "Specialist"}
              </p>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Column 1 */}
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Basic Information
                    </h3>
                    <p>
                      <strong>Full Name:</strong> {doctorData?.fullName || "—"}
                    </p>
                    <p>
                      <strong>Specialty:</strong> {doctorData?.specialty || "—"}
                    </p>
                    <p>
                      <strong>Qualification:</strong>{" "}
                      {doctorData?.qualification || "—"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Contact
                    </h3>
                    <p>
                      <strong>Email:</strong> {doctorData?.email || "—"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {doctorData?.phoneNumber || "—"}
                    </p>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Professional Details
                    </h3>
                    <p>
                      <strong>Experience:</strong>{" "}
                      {doctorData?.experienceYears
                        ? `${doctorData.experienceYears} years`
                        : "—"}
                    </p>
                    <p>
                      <strong>Clinic/Hospital:</strong>{" "}
                      {doctorData?.clinicName || "—"}
                    </p>
                    <p>
                      <strong>Clinic Address:</strong>{" "}
                      {doctorData?.clinicAddress || "—"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Availability
                    </h3>
                    <p>{doctorData?.availability || "Not specified"}</p>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Fees & Bio
                    </h3>
                    <p>
                      <strong>Consultation Fee:</strong>{" "}
                      {doctorData?.consultationFee
                        ? `₹${doctorData.consultationFee}`
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      About
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {doctorData?.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-wrap gap-4">
                <Link
                  href="/dashboard/doctor/edit-profile"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Edit Profile
                </Link>

                <Link
                  href="/dashboard/doctor/appointments"
                  className="relative bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium inline-flex items-center"
                >
                  View Appointments
                  {newAppointmentsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      {newAppointmentsCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
