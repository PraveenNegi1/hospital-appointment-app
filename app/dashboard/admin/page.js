"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Menu,
  X,
  LayoutDashboard,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/admin",
    },
    {
      name: "Pending Doctors",
      icon: UserCheck,
      href: "/dashboard/admin/approve-doctors",
    },
    {
      name: "Approved Doctors",
      icon: Users,
      href: "/dashboard/admin/approved-doctors",
    },
    {
      name: "Rejected Doctors",
      icon: UserX,
      href: "/dashboard/admin/rejected-doctors",
    },
  ];

  /* ---------- Get Logged-in Admin Name ---------- */
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminName(
          user.displayName ||
          user.email?.split("@")[0] ||
          "Admin"
        );
      }
    });

    return () => unsubscribe();
  }, []);

  /* ---------- Fetch Dashboard Stats ---------- */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const doctorsRef = collection(db, "doctors");

        const totalSnap = await getDocs(doctorsRef);
        const pendingSnap = await getDocs(
          query(doctorsRef, where("status", "==", "pending"))
        );
        const approvedSnap = await getDocs(
          query(doctorsRef, where("status", "==", "approved"))
        );
        const rejectedSnap = await getDocs(
          query(doctorsRef, where("status", "==", "rejected"))
        );

        setStats({
          total: totalSnap.size,
          pending: pendingSnap.size,
          approved: approvedSnap.size,
          rejected: rejectedSnap.size,
        });
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-100">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-xl shadow-lg"
        >
          <Menu size={22} />
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 w-72 bg-white shadow-2xl z-40 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <h2 className="text-2xl font-bold text-indigo-600">
              Admin Panel
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-gray-600"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="p-5 space-y-3">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium"
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome, {adminName} 👋
          </h1>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <p className="text-gray-500">Loading dashboard data...</p>
            ) : (
              <>
                <StatCard title="Total Doctors" value={stats.total} color="indigo" />
                <StatCard title="Pending Approvals" value={stats.pending} color="yellow" />
                <StatCard title="Approved Doctors" value={stats.approved} color="green" />
                <StatCard title="Rejected Doctors" value={stats.rejected} color="red" />
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

/* ---------- Reusable Stat Card ---------- */
function StatCard({ title, value, color }) {
  const colors = {
    indigo: "text-indigo-600",
    yellow: "text-yellow-500",
    green: "text-green-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-700">
        {title}
      </h3>
      <p className={`text-4xl font-bold mt-3 ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}
