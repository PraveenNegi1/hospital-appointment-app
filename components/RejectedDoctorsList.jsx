"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RejectedDoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState({});

  const fetchRejectedDoctors = async () => {
    try {
      const q = query(collection(db, "doctors"), where("status", "==", "rejected"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setDoctors(list);
    } catch (err) {
      console.error("Error fetching rejected doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this rejected doctor permanently?")) return;

    setDeleteLoading((prev) => ({ ...prev, [id]: true }));

    try {
      await deleteDoc(doc(db, "doctors", id));
      setDoctors((prev) => prev.filter((d) => d.id !== id));
      alert("Doctor deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete doctor.");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-600">
        <h3 className="text-xl font-medium">No rejected doctors</h3>
        <p className="mt-2">Rejected doctors will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {doctors.map((doctor) => (
            <tr key={doctor.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {doctor.fullName || doctor.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {doctor.specialty || "—"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {doctor.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDelete(doctor.id)}
                  disabled={deleteLoading[doctor.id]}
                  className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                    deleteLoading[doctor.id]
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {deleteLoading[doctor.id] ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}