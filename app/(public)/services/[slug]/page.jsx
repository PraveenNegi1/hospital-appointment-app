import { notFound } from "next/navigation";
import { servicesData } from "../data";

export default async function ServiceDetail({ params }) {
  // ✅ Next.js 15+ requires awaiting params
  const { slug } = await params;

  const service = servicesData.find((s) => s.slug === slug);

  if (!service) return notFound();

  const Icon = service.icon;

  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {service.title}
          </h1>
        </div>

        {/* Overview */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <p className="text-gray-600 leading-relaxed">
            {service.content.overview}
          </p>
        </section>

        {/* Key Highlights */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Key Highlights</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {service.points.map((point, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-gray-700"
              >
                ✅ {point}
              </li>
            ))}
          </ul>
        </section>

        {/* Treatments */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Treatments & Services
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            {service.content.treatments.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Facilities */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Facilities</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {service.content.facilities.map((facility, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg px-4 py-3 text-gray-700"
              >
                🏥 {facility}
              </div>
            ))}
          </div>
        </section>

        {/* Doctors */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Our Specialists
          </h2>
          <div className="flex flex-wrap gap-3">
            {service.content.doctors.map((doctor, i) => (
              <span
                key={i}
                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                {doctor}
              </span>
            ))}
          </div>
        </section>

        {/* FAQs */}
        {service.content.faqs && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {service.content.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border rounded-xl p-4"
                >
                  <h4 className="font-semibold text-gray-900">
                    {faq.q}
                  </h4>
                  <p className="mt-2 text-gray-600">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="bg-blue-600 text-white rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Need Help with {service.title}?
          </h3>
          <p className="mb-4 opacity-90">
            Book an appointment with our specialists today.
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 transition">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
