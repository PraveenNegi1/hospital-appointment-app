export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4">About Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Making healthcare appointments simple, fast, and accessible for
            everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our mission is to bridge the gap between patients and healthcare
              professionals by providing a seamless online appointment booking
              system. We aim to save time, reduce waiting periods, and improve
              access to quality medical care.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <ul className="space-y-4 text-gray-700">
              <li>✔ Easy doctor appointment booking</li>
              <li>✔ Verified healthcare professionals</li>
              <li>✔ Secure patient data</li>
              <li>✔ Faster access to medical services</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Us
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              title="Trusted Doctors"
              description="All doctors are verified and approved before onboarding."
            />
            <FeatureCard
              title="Easy Scheduling"
              description="Book, reschedule, or cancel appointments in just a few clicks."
            />
            <FeatureCard
              title="Patient-Centered"
              description="Designed with patients in mind for a smooth experience."
            />
            <FeatureCard
              title="Secure Platform"
              description="We prioritize data privacy and secure authentication."
            />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Our Vision
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            To become a trusted digital healthcare platform that empowers
            patients and doctors by simplifying appointment management and
            improving healthcare accessibility across communities.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Small Component ---------------- */

function FeatureCard({ title, description }) {
  return (
    <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
      <h3 className="text-xl font-bold mb-3 text-indigo-600">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
