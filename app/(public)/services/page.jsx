import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { servicesData } from "./data";

export default function ServicesPage() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our Medical Services
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.slug}
                className="bg-white p-6 rounded-2xl shadow flex flex-col"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Icon className="text-blue-600 w-6 h-6" />
                </div>

                <h3 className="text-xl font-semibold">
                  {service.title}
                </h3>

                <p className="mt-2 text-gray-600">
                  {service.shortDesc}
                </p>

                <ul className="mt-4 space-y-2 text-sm text-gray-600 flex-1">
                  {service.points.map((p, i) => (
                    <li key={i} className="flex gap-2 items-center">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      {p}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services/${service.slug}`}
                  className="mt-6 text-blue-600 font-semibold"
                >
                  Learn More →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
