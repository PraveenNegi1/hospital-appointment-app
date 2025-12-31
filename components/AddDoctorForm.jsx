// app/components/AddDoctorForm.jsx
"use client";

import { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCircle, UserPlus } from "lucide-react";

export default function AddDoctorForm() {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    clinicName: "",
    address: "",
    qualifications: "",
    experience: "",
    fee: "",
    bio: "",
    photoURL: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const specialties = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedic",
    "Neurologist",
    "Gynecologist",
    "Dentist",
    "Psychiatrist",
  ];

  const generateDefaultSlots = () => {
    const slots = {};
    const today = new Date();
    const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      slots[dateStr] = timeSlots;
    }
    return slots;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.specialty) {
      setError("Name, Email and Specialty are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const doctorId = formData.email.trim().toLowerCase();

      await setDoc(doc(db, "doctors", doctorId), {
        name: formData.name.trim(),
        specialty: formData.specialty.trim(),
        email: doctorId,
        phone: formData.phone.trim() || "",
        clinicName: formData.clinicName.trim() || "Not specified",
        address: formData.address.trim() || "Not specified",
        qualifications: formData.qualifications.trim() || "Not specified",
        experience: formData.experience ? Number(formData.experience) : 0,
        fee: formData.fee ? Number(formData.fee) : 0,
        bio: formData.bio.trim() || "Dedicated to excellent patient care.",
        photoURL: formData.photoURL.trim() || "",
        availableSlots: generateDefaultSlots(),
        approved: false, // Pending admin approval
        requestedAt: new Date(),
        createdAt: new Date(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting doctor:", err);
      setError("Failed to submit. " + (err.message || "Try again."));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      specialty: "",
      email: "",
      phone: "",
      clinicName: "",
      address: "",
      qualifications: "",
      experience: "",
      fee: "",
      bio: "",
      photoURL: "",
    });
    setError("");
  };

  // Success View
  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10 text-center">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
        <h3 className="text-3xl font-bold text-green-800 mb-4">
          Doctor Profile Submitted!
        </h3>
        <p className="text-xl text-gray-700 mb-8">
          <strong>Add New Doctor (Pending Admin Approval)</strong>
        </p>
        <p className="text-gray-600 mb-8">
          Your profile has been sent for review. You will be able to log in once the admin approves it.
        </p>
        <button
          onClick={resetForm}
          className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition shadow-lg"
        >
          <UserPlus className="w-6 h-6" />
          Add Another Doctor
        </button>
      </div>
    );
  }

  // Form View
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <h3 className="text-3xl font-bold text-white text-center flex items-center justify-center gap-4">
            <UserPlus className="w-10 h-10" />
            Add New Doctor (Pending Admin Approval)
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Sarah Johnson"
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialty <span className="text-red-500">*</span>
              </label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
              >
                <option value="">-- Choose Specialty --</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email (Your Login ID) <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sarah@example.com"
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be your login username
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Clinic / Hospital Name
              </label>
              <input
                type="text"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                placeholder="Healing Hands Clinic"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                placeholder="800"
                min="0"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="12"
                min="0"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Qualifications
              </label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="MBBS, MD (Medicine)"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Clinic Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="123 Wellness Street, Mumbai, India"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio / About You
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="5"
              placeholder="Tell patients about your experience and approach..."
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Photo URL (Optional)
            </label>
            <input
              type="url"
              name="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload your photo to ImgBB or similar and paste the direct link.
            </p>
          </div>

          <div className="text-center pt-8">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xl py-5 px-12 rounded-2xl shadow-2xl transition transform hover:scale-105 disabled:opacity-70"
            >
              <UserPlus className="w-8 h-8" />
              {loading ? "Submitting..." : "Submit for Admin Approval"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            After admin approval, you will be able to log in with your email and password.
          </p>
        </form>
      </div>
    </div>
  );
}