"use client";

import { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.specialty) {
      alert("Please fill in all required fields: Name, Email, and Specialty.");
      return;
    }

    setLoading(true);

    try {
      await setDoc(doc(db, "doctors", formData.email.trim().toLowerCase()), {
        name: formData.name.trim(),
        specialty: formData.specialty.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        clinicName: formData.clinicName.trim() || "Not specified",
        address: formData.address.trim() || "Not specified",
        qualifications: formData.qualifications.trim() || "Not specified",
        experience: formData.experience ? parseInt(formData.experience) : 0,
        fee: formData.fee ? parseFloat(formData.fee) : 0,
        bio:
          formData.bio.trim() ||
          "Experienced doctor dedicated to patient care.",
        photoURL: formData.photoURL.trim() || "",
        availableSlots: generateDefaultSlots(),
        approved: false,
        requestedAt: new Date(),
        createdAt: new Date(),
      });

      alert(
        "Doctor profile submitted successfully! Waiting for admin approval."
      );

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
    } catch (err) {
      console.error("Error adding doctor:", err);
      alert("Failed to submit. Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form
        onSubmit={handleAdd}
        className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Add New Doctor (Pending Admin Approval)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dr. John Doe"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specialty <span className="text-red-500">*</span>
            </label>
            <select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select Specialty --</option>
              <option value="General Physician">General Physician</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dentist">Dentist</option>
              <option value="Psychiatrist">Psychiatrist</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email (Login ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="doctor@example.com"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone */}
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
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Clinic Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Clinic / Hospital Name
            </label>
            <input
              type="text"
              name="clinicName"
              value={formData.clinicName}
              onChange={handleChange}
              placeholder="Sunrise Medical Center"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              placeholder="500"
              min="0"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              placeholder="10"
              min="0"
              max="50"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Qualifications (e.g., MBBS, MD)
            </label>
            <input
              type="text"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              placeholder="MBBS, MD (Cardiology)"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Address */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Clinic Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            placeholder="123 Health Street, Mumbai, Maharashtra"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bio / About Doctor
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Write a short introduction about the doctor's expertise and approach..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Profile Photo URL (optional)
          </label>
          <input
            type="url"
            name="photoURL"
            value={formData.photoURL}
            onChange={handleChange}
            placeholder="https://example.com/doctor-photo.jpg"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste a direct link to the doctor's photo (from Google Drive, ImgBB,
            etc.)
          </p>
        </div>

        {/* Submit Button */}
        <div className="mt-10">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-5 rounded-xl text-lg transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting Request..." : "Submit Doctor for Approval"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          This doctor will be reviewed by admin and approved before appearing to
          patients.
        </p>
      </form>
    </div>
  );
}
