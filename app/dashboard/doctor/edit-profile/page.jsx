"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function EditDoctorProfile() {
  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [qualification, setQualification] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [availability, setAvailability] = useState(""); // e.g. "Mon-Fri 10AM-4PM"
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        const docRef = doc(db, "doctors", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || "");
          setSpecialty(data.specialty || "");
          setExperienceYears(data.experienceYears || "");
          setQualification(data.qualification || "");
          setPhoneNumber(data.phoneNumber || "");
          setClinicName(data.clinicName || "");
          setClinicAddress(data.clinicAddress || "");
          setConsultationFee(data.consultationFee || "");
          setAvailability(data.availability || "");
          setBio(data.bio || "");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load your profile");
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      const docRef = doc(db, "doctors", user.uid);

      await updateDoc(docRef, {
        fullName: fullName.trim(),
        specialty: specialty.trim(),
        experienceYears: experienceYears.trim(),
        qualification: qualification.trim(),
        phoneNumber: phoneNumber.trim(),
        clinicName: clinicName.trim(),
        clinicAddress: clinicAddress.trim(),
        consultationFee: consultationFee.trim(),
        availability: availability.trim(),
        bio: bio.trim(),
        updatedAt: new Date().toISOString(),
        // Optional: add status if you want to reset to pending on edit
        // status: "pending",
      });

      setSuccess(true);

      // Redirect to main doctor dashboard after 1.5 seconds
      setTimeout(() => {
        router.push("/dashboard/doctor");
      }, 1500);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Edit Your Doctor Profile
        </h1>
        <p className="text-gray-600 mb-10">
          Keep your information up-to-date so patients can find you easily.
        </p>

        {success && (
          <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-lg">
            Profile updated successfully! Redirecting to dashboard...
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Dr. John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Specialty *
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Cardiology, Pediatrics, Orthopedics..."
              />
            </div>
          </div>

          {/* Professional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Years of Experience
              </label>
              <input
                type="text"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="12 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Qualification (MD, MBBS, etc.) *
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="MD Cardiology, MBBS"
              />
            </div>
          </div>

          {/* Contact & Clinic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Consultation Fee (₹)
              </label>
              <input
                type="text"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Clinic / Hospital Name
            </label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="City Heart Clinic"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Clinic Address
            </label>
            <textarea
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="123, Medical Lane, New Delhi - 110001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Availability (e.g., Mon-Fri 10AM-4PM)
            </label>
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Mon-Fri 10:00 AM - 4:00 PM"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Professional Bio / About
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Write a short description about your experience, expertise, and approach to patient care..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-6 rounded-xl text-white font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              "Save Profile & Go to Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
