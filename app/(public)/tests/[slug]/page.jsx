import { notFound } from "next/navigation";
import { testsData } from "../../../../data/testsData";

export default async function TestDetailsPage({ params }) {
  const { slug } = await params;

  const test = testsData.find((t) => t.slug === slug);

  if (!test) {
    notFound();
  }

  const Icon = test.icon;

  return (
    <section className="min-h-screen  py-16 px-4 font-serif">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-blue-100 rounded-xl text-blue-600 text-3xl">
            <Icon />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{test.title}</h1>
            <p className="text-gray-500">{test.department}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{test.fullDescription}</p>

        {/* Info Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Info label="Sample Type" value={test.sampleType} />
          <Info label="Preparation" value={test.preparation} />
          <Info label="Duration" value={test.duration} />
          <Info label="Report Time" value={test.reportTime} />
          <Info label="Age Group" value={test.ageGroup} />
          <Info label="Price" value={test.price} />
        </div>

        {/* Extra Details */}
        <div className="mt-8 space-y-6">
          <Section title="Who Should Take This Test">
            {test.whoShouldTake}
          </Section>

          <Section title="Normal Range">
            {test.normalRange || "Varies based on patient condition"}
          </Section>

          <Section title="Risks Involved">{test.risks}</Section>

          <Section title="Follow Up">{test.followUp}</Section>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition">
            Book This Test
          </button>
          <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-medium transition">
            Consult Doctor
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Reusable Components ---------- */

function Info({ label, value }) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{children}</p>
    </div>
  );
}
