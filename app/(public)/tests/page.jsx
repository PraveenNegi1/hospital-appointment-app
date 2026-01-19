import Link from "next/link";
import { testsData } from "@/data/testsData";

export default function TestsPage() {
  return (
    <section className="font-serif min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
          Diagnostic Tests
        </h1>
        <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto">
          Explore our wide range of diagnostic tests with accurate and reliable
          results.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {testsData.map((test) => {
            const Icon = test.icon;

            return (
              <Link
                key={test.slug}
                href={`/tests/${test.slug}`}
                className="group bg-white rounded-2xl p-6 text-center shadow-sm
                           hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 mx-auto flex items-center justify-center
                             rounded-full bg-blue-100 group-hover:bg-blue-600
                             transition-colors duration-300"
                >
                  <Icon
                    className="text-blue-600 text-2xl
                               group-hover:text-white transition-colors duration-300"
                  />
                </div>

                {/* Title */}
                <h3 className="mt-5 text-lg font-semibold text-gray-800">
                  {test.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-2">
                  {test.shortDescription}
                </p>

                {/* CTA */}
                <span className="inline-block mt-4 text-blue-600 font-medium group-hover:underline">
                  View Details →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
