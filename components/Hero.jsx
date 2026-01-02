"use client";

export default function HospitalHero() {
  return (
    <section className=" text-black py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Caring for Life, <br /> Healing with Heart
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Advanced medical care with experienced doctors and modern facilities.
          </p>

          <div className="mt-6 flex gap-4">
            <button className="bg-white text-gray-600 border px-6 py-3 rounded-lg font-semibold hover:bg-blue-100">
              Book Appointment
            </button>
            <button className="border border-black px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600">
              Contact Us
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <img
            src="/hospitalhero.svg"
            alt="Hospital"
            className="rounded-xl "
          />
        </div>
      </div>
    </section>
  );
}
