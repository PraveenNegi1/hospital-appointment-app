import ProtectedRoute from '@/components/ProtectedRoute';
import AdminApproveDoctors from '@/components/AdminApproveDoctors';
import Link from 'next/link';

export default function ApproveDoctorsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen font-serif bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Pending Doctor Approvals
            </h1>
            <Link
              href="/dashboard/admin"
              className="mt-4 md:mt-0  p-4 rounded-2xl border border-gray-600 text-indigo-600 hover:text-indigo-800 font-medium text-lg"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <AdminApproveDoctors />
        </div>
      </div>
    </ProtectedRoute>
  );
}