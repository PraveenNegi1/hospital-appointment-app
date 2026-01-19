import Link from "next/link";
import {
  FaVial,
  FaXRay,
  FaBrain,
  FaMicroscope,
  FaHeartbeat,
  FaStethoscope,
  FaBaby,
  FaFlask,
} from "react-icons/fa";

export default function HospitalTests() {
  const tests = [
    {
      title: "Blood Tests",
      description:
        "Complete blood count, sugar, cholesterol, liver & kidney tests.",
      icon: <FaVial />,
    },
    {
      title: "X-Ray",
      description: "Digital X-ray services for chest, bones, and joints.",
      icon: <FaXRay />,
    },
    {
      title: "MRI Scan",
      description: "Advanced MRI scanning for brain, spine, and soft tissues.",
      icon: <FaBrain />,
    },
    {
      title: "CT Scan",
      description: "High-precision CT scans for accurate diagnosis.",
      icon: <FaMicroscope />,
    },
    {
      title: "Ultrasound",
      description: "Safe and painless ultrasound imaging services.",
      icon: <FaBaby />,
    },
    {
      title: "ECG",
      description: "Electrocardiogram tests to monitor heart health.",
      icon: <FaHeartbeat />,
    },
    {
      title: "Echocardiography",
      description: "Detailed heart imaging to assess heart function.",
      icon: <FaStethoscope />,
    },
    {
      title: "Urine Tests",
      description: "Routine and advanced urine analysis tests.",
      icon: <FaFlask />,
    },
  ];

  return (
    <section className="font-serif py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Diagnostic Tests We Offer
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Comprehensive diagnostic services with advanced technology and
            accurate reporting.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tests.map((test, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 text-center
                         shadow-md hover:shadow-xl transition-all duration-300
                         hover:-translate-y-2"
            >
              {/* Icon */}
              <div
                className="mx-auto mb-5 w-16 h-16 flex items-center justify-center
                           rounded-full bg-blue-100 text-blue-600 text-2xl
                           group-hover:bg-blue-600 group-hover:text-white
                           transition"
              >
                {test.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                {test.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">{test.description}</p>

            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <Link
            href="/tests"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700
                       text-white px-10 py-4 rounded-full font-semibold
                       shadow-lg hover:shadow-xl transition"
          >
            Check More Tests
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
