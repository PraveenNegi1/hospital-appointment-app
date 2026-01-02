"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

// ✅ IMPORTANT: correct import
import { servicesData } from "@/app/(public)/services/data";

export default function Services() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Our Medical Services
          </h2>
          <p className="mt-3 text-gray-600 text-base md:text-lg">
            We provide a wide range of medical services with advanced technology
            and compassionate care.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.slug}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Icon className="text-blue-600 w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-gray-600 text-sm md:text-base">
                  {service.shortDesc}
                </p>

                {/* Highlights */}
                <ul className="mt-4 space-y-2 text-sm text-gray-600 flex-1">
                  {service.points.slice(0, 3).map((point, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      {point}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-6 text-blue-600 font-semibold hover:text-blue-700"
                >
                  Learn More →
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
