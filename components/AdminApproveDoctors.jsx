"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminApproveDoctors() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const fetchPendingDoctors = async () => {
    try {
      const q = query(
        collection(db, "doctors"),
        where("status", "in", ["pending", "pending-review"])
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setPendingDoctors(list);
    } catch (err) {
      console.error("Error fetching pending doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleApprove = async (id) => {
    if (!confirm("Approve this doctor? They will be visible on the website."))
      return;

    setActionLoading((prev) => ({ ...prev, [id]: true }));

    try {
      const doctorRef = doc(db, "doctors", id);
      await updateDoc(doctorRef, {
        status: "approved",
        approvedAt: new Date().toISOString(),
        // Optional: approvedBy: auth.currentUser.uid
      });

      // Remove from pending list
      setPendingDoctors((prev) => prev.filter((d) => d.id !== id));
      alert("Doctor approved successfully!");
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve doctor. Check permissions.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason (optional):");
    if (reason === null) return; // user canceled

    setActionLoading((prev) => ({ ...prev, [id]: true }));

    try {
      const doctorRef = doc(db, "doctors", id);
      await updateDoc(doctorRef, {
        status: "rejected",
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason.trim() || "No reason provided",
      });

      // Remove from pending list
      setPendingDoctors((prev) => prev.filter((d) => d.id !== id));
      alert("Doctor rejected.");
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Failed to reject doctor.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  if (pendingDoctors.length === 0) {
    return (
      <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-600">
        <h3 className="text-xl font-medium">No pending doctor approvals</h3>
        <p className="mt-2">
          New doctors will appear here when they sign up and request approval.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Specialty
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pendingDoctors.map((doctor) => (
            <tr key={doctor.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {doctor.fullName || doctor.name || "Unnamed"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {doctor.specialty || "—"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {doctor.email || "—"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(doctor.id)}
                    disabled={actionLoading[doctor.id]}
                    className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                      actionLoading[doctor.id]
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReject(doctor.id)}
                    disabled={actionLoading[doctor.id]}
                    className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                      actionLoading[doctor.id]
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
