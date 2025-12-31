"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, HeartPulse } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="w-8 h-8 text-indigo-600" />
          <span className="text-2xl font-extrabold text-gray-900">
            Health<span className="text-indigo-600">Care</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/about"
            className="text-gray-700 font-medium hover:text-indigo-600 transition"
          >
            About
          </Link>

          <Link
            href="/doctors"
            className="text-gray-700 font-medium hover:text-indigo-600 transition"
          >
            Doctors
          </Link>

          <Link
            href="/login"
            className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col gap-4 px-6 py-6">
            <Link
              href="/#about"
              onClick={() => setOpen(false)}
              className="text-gray-700 font-medium hover:text-indigo-600"
            >
              About
            </Link>

            <Link
              href="/doctors"
              onClick={() => setOpen(false)}
              className="text-gray-700 font-medium hover:text-indigo-600"
            >
              Doctors
            </Link>

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-6 py-3 text-center bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
