import Link from "next/link";

export default function DoctorProfileCard({ doctor }) {
  if (!doctor) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold">
          Dr. {doctor.fullName?.split(" ").pop() || "Doctor"}
        </h2>
        <p className="mt-2 text-indigo-100 text-lg">{doctor.specialty || "Specialist"}</p>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-700">
              <strong>Email:</strong> {doctor.email}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <p className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {doctor.status || "Pending Approval"}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            href="/dashboard/doctor/edit-profile"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}