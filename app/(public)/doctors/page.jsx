"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BookingModal from "@/components/BookingModal"; // Adjust path as needed

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchApprovedDoctors = async () => {
      try {
        const q = query(
          collection(db, "doctors"),
          where("status", "==", "approved"),
        );
        const querySnapshot = await getDocs(q);

        const doctorsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDoctors(doctorsList);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedDoctors();
  }, []);

  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDoctor(null), 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading approved doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-lg w-full">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 text-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-serif bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full  ">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl  font-bold text-gray-900 mb-4">
            Our Approved Doctors
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book appointments with trusted and verified medical professionals
          </p>
        </div>

        {doctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              No Doctors Available
            </h3>
            <p className="text-lg text-gray-600">
              There are currently no approved doctors in the system.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3  gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Doctor Header */}
                <div className="bg-linear-to-r from-indigo-500 to-indigo-700 p-6 text-white">
                  <h3 className="text-2xl font-bold">
                    Dr.{" "}
                    {doctor.fullName?.split(" ").pop() ||
                      doctor.name ||
                      "Doctor"}
                  </h3>
                  <p className="mt-2 text-indigo-100 text-lg">
                    {doctor.specialty || "Specialist"}
                  </p>
                </div>

                {/* All Details */}
                <div className="p-6 grow space-y-4 text-gray-700">
                  <p>
                    <span className="font-semibold">Qualification:</span>{" "}
                    {doctor.qualification || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Experience:</span>{" "}
                    {doctor.experienceYears
                      ? `${doctor.experienceYears} years`
                      : "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Clinic/Hospital:</span>{" "}
                    {doctor.clinicName || doctor.hospitalName || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Consultation Fee:</span>{" "}
                    {doctor.consultationFee || doctor.fee
                      ? `₹${doctor.consultationFee || doctor.fee}`
                      : "—"}
                  </p>

                  {/* Additional details - shown always */}
                  {doctor.bio && (
                    <p>
                      <span className="font-semibold">About:</span> {doctor.bio}
                    </p>
                  )}
                  {doctor.languages && (
                    <p>
                      <span className="font-semibold">Languages:</span>{" "}
                      {Array.isArray(doctor.languages)
                        ? doctor.languages.join(", ")
                        : doctor.languages}
                    </p>
                  )}
                  {doctor.timings && (
                    <p>
                      <span className="font-semibold">Timings:</span>{" "}
                      {doctor.timings}
                    </p>
                  )}
                  {doctor.hospitalAddress && (
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {doctor.hospitalAddress}
                    </p>
                  )}
                  {doctor.achievements && (
                    <p>
                      <span className="font-semibold">Achievements:</span>{" "}
                      {doctor.achievements}
                    </p>
                  )}
                </div>

                {/* Footer with Book Appointment button */}
                <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => openBookingModal(doctor)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
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
