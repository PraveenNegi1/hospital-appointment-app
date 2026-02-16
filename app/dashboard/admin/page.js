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
  User,
  Stethoscope,
} from "lucide-react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    pendingDoctors: 0,
    approvedDoctors: 0,
    rejectedDoctors: 0,
  });
  const [userGrowthData, setUserGrowthData] = useState({
    labels: [],
    data: [],
  });

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/admin" },
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

  // Get logged-in admin name
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminName(user.displayName || user.email?.split("@")[0] || "Admin");
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch all stats + user growth data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Total users
        const usersSnap = await getDocs(collection(db, "users"));
        const totalUsers = usersSnap.size;

        // Total doctors (role == "doctor")
        const doctorsQuery = query(
          collection(db, "users"),
          where("role", "==", "doctor")
        );
        const doctorsSnap = await getDocs(doctorsQuery);
        const totalDoctors = doctorsSnap.size;

        // Doctor statuses
        const doctorsRef = collection(db, "doctors");
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
          totalUsers,
          totalDoctors,
          pendingDoctors: pendingSnap.size,
          approvedDoctors: approvedSnap.size,
          rejectedDoctors: rejectedSnap.size,
        });

        // User signup growth (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const userGrowth = {};
        const months = [];

        usersSnap.docs.forEach((doc) => {
          const createdAt = doc.data().createdAt?.toDate?.();
          if (createdAt && createdAt >= sixMonthsAgo) {
            const monthKey = createdAt.toLocaleString("default", {
              month: "short",
              year: "numeric",
            });
            userGrowth[monthKey] = (userGrowth[monthKey] || 0) + 1;
          }
        });

        // Fill last 6 months even if no signups
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthKey = date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          months.unshift(monthKey);
        }

        const growthData = months.map((m) => userGrowth[m] || 0);

        setUserGrowthData({
          labels: months,
          data: growthData,
        });
      } catch (error) {
        console.error("Dashboard stats error:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Bar Chart Data
  const barChartData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        label: "Doctor Status",
        data: [
          stats.pendingDoctors,
          stats.approvedDoctors,
          stats.rejectedDoctors,
        ],
        backgroundColor: ["#FBBF24", "#10B981", "#EF4444"],
        borderColor: ["#D97706", "#059669", "#B91C1C"],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Line Chart Data (real user growth)
  const lineChartData = {
    labels: userGrowthData.labels,
    datasets: [
      {
        label: "New User Signups",
        data: userGrowthData.data,
        borderColor: "#6366F1",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex font-serif min-h-screen bg-linear-to-br from-gray-50 via-indigo-50 to-purple-50">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-lg shadow-2xl z-40 transform transition-transform duration-300 border-r border-indigo-100
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="flex items-center justify-between px-6 py-6 border-b border-indigo-100">
            <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="p-6 space-y-2">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 px-5 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition font-medium group"
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-12">
            <h1 className="text-3xl font-serif  font-extrabold text-transparent bg-clip-text bg-indigo-600">
              Welcome, {adminName} 
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Here's your complete platform overview
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {loading ? (
              <div className="col-span-full flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600" />
              </div>
            ) : (
              <>
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  color="indigo"
                  icon={User}
                />
                <StatCard
                  title="Total Doctors"
                  value={stats.totalDoctors}
                  color="purple"
                  icon={Stethoscope}
                />
                <StatCard
                  title="Pending Doctors"
                  value={stats.pendingDoctors}
                  color="yellow"
                  icon={UserCheck}
                />
                <StatCard
                  title="Approved Doctors"
                  value={stats.approvedDoctors}
                  color="green"
                  icon={Users}
                />
                <StatCard
                  title="Rejected Doctors"
                  value={stats.rejectedDoctors}
                  color="red"
                  icon={UserX}
                />
              </>
            )}
          </div>

          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart - Doctor Status */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Doctor Approval Status
                </h2>
                <div className="h-80">
                  <Bar
                    data={barChartData}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          display: true,
                          text: "Doctor Approval Status",
                          font: { size: 18 },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Line Chart - User Growth */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  User Signup Growth (Last 6 Months)
                </h2>
                <div className="h-80">
                  <Line
                    data={lineChartData}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          display: true,
                          text: "User Signup Growth",
                          font: { size: 18 },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

/* Reusable Stat Card */
function StatCard({ title, value, color, icon: Icon }) {
  const colorMap = {
    indigo: "from-indigo-500 to-indigo-600 text-indigo-600",
    purple: "from-purple-500 to-purple-600 text-purple-600",
    yellow: "from-yellow-500 to-yellow-600 text-yellow-600",
    green: "from-green-500 to-green-600 text-green-600",
    red: "from-red-500 to-red-600 text-red-600",
  };

  return (
    <div className="group relative bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-linear-to-br ${
          colorMap[color].split(" ")[0]
        }`}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            {title}
          </h3>
          {Icon && (
            <Icon
              size={28}
              className={`${
                colorMap[color].split(" ")[1]
              } opacity-80 group-hover:opacity-100 transition-opacity`}
            />
          )}
        </div>
        <p
          className={`text-4xl font-extrabold ${colorMap[color].split(" ")[1]}`}
        >
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
