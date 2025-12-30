"use client";

export default function HospitalHero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Caring for Life, <br /> Healing with Heart
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            Advanced medical care with experienced doctors and modern facilities.
          </p>

          <div className="mt-6 flex gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100">
              Book Appointment
            </button>
            <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600">
              Contact Us
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <img
            src="/hospital-hero.png"
            alt="Hospital"
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
