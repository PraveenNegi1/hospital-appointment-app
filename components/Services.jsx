const services = [
  { title: "Emergency Care", desc: "24/7 emergency services with expert doctors." },
  { title: "Cardiology", desc: "Advanced heart care & diagnostics." },
  { title: "Neurology", desc: "Brain & nerve treatment specialists." },
  { title: "Pediatrics", desc: "Complete child healthcare services." },
];

export default function Services() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Medical Services
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-blue-600">
                {service.title}
              </h3>
              <p className="mt-3 text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
