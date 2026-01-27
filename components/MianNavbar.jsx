"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  HeartPulse,
  LogOut,
  User,
  Home,
  Info,
  Stethoscope,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";

export default function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push("/auth/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 font-serif bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          
          <Link href="/" className="flex items-center gap-2.5">
            <HeartPulse className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-extrabold text-gray-900">
              Health<span className="text-indigo-600">Care</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink href="/" label="Home" />
            <NavLink href="/about" label="About" />
            <NavLink href="/doctors" label="Doctors" />
            <NavLink href="/my-appointments" label="My Appointments" />

            {loading ? (
              <div className="w-40 h-10 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="font-semibold text-gray-800">
                    Hi, {displayName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 font-medium transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signup"
                className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition shadow-md"
              >
                Sign Up
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar (Drawer) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeMenu}
        />

        {/* Sidebar Panel */}
        <div
          className={`absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <HeartPulse className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">
                Health<span className="text-indigo-600">Care</span>
              </span>
            </div>
            <button
              onClick={closeMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex flex-col py-6 px-5">
            <MobileNavLink
              href="/"
              label="Home"
              icon={Home}
              onClick={closeMenu}
            />
            <MobileNavLink
              href="/about"
              label="About"
              icon={Info}
              onClick={closeMenu}
            />
            <MobileNavLink
              href="/doctors"
              label="Doctors"
              icon={Stethoscope}
              onClick={closeMenu}
            />
            <MobileNavLink
              href="/my-appointments"
              label="My Appointments"
              icon={Calendar}
              onClick={closeMenu}
            />

            <div className="mt-10 pt-6 border-t border-gray-200">
              {user ? (
                <>
                  <div className="flex items-center gap-4 px-4 py-3 mb-4 bg-indigo-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {displayName}
                      </p>
                      <p className="text-sm text-gray-600">Signed in</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signup"
                  onClick={closeMenu}
                  className="block text-center py-4 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-md"
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      className="text-gray-700 font-medium hover:text-indigo-600 transition"
    >
      {label}
    </Link>
  );
}

// Reusable Mobile NavLink
function MobileNavLink({ href, label, icon: Icon, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 py-4 px-5 text-lg font-medium text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition"
    >
      {Icon && <Icon className="w-6 h-6 text-gray-500" />}
      {label}
    </Link>
  );
}
