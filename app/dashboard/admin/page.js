import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Admin Dashboard
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Doctor Management */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 text-white text-center">
                <h2 className="text-2xl font-bold">Doctor Management</h2>
                <p className="mt-3 text-indigo-100">
                  Approve, reject & manage doctors
                </p>
              </div>
              <div className="p-8 space-y-5">
                <Link
                  href="/dashboard/admin/approve-doctors"
                  className="block bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-xl text-center transition shadow-md"
                >
                  Pending Approvals
                </Link>
                <Link
                  href="/dashboard/admin/approved-doctors"
                  className="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-xl text-center transition shadow-md"
                >
                  Approved Doctors
                </Link>
                <Link
                  href="/dashboard/admin/rejected-doctors"
                  className="block bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-xl text-center transition shadow-md"
                >
                  Rejected Doctors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
