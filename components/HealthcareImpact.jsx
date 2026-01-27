"use client";

import { useState } from "react";
import { User, Users, HeartPulse } from "lucide-react";

const cards = [
  {
    title: "Our Healthcare Impact",
    description:
      "We transform healthcare by making quality medical services accessible, affordable, and patient-focused. Our platform improves outcomes through early diagnosis, modern clinics, and compassionate care.",
    icon: User,
    color: "bg-[#6fd3cf]",
  },
  {
    title: "Our Doctors",
    description:
      "Highly experienced doctors and certified specialists across disciplines. Carefully vetted professionals ensuring safety, trust, and world-class treatment outcomes.",
    icon: Users,
    color: "bg-[#7a63ff]",
  },
  {
    title: "Why Choose Us",
    description:
      "Patient-first healthcare powered by technology. Transparent pricing, digital records, 24/7 support, and trusted care for families.",
    icon: HeartPulse,
    color: "bg-[#ff6b6b]",
  },
];

export default function HealthcareImpact() {
  const [active, setActive] = useState(0);

  return (
    <section className="w-full font-serif px-4 md:px-10 py-16 md:py-20 bg-white">
      <h2 className="text-3xl  font-bold font-serif text-center mb-12 md:mb-16 text-gray-900">
        Let Us Help You Find the Care You Deserve
      </h2>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-5 md:gap-6 h-[70vh] md:h-[65vh] lg:h-[70vh]">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isActive = index === active;

          return (
            <div
              key={index}
              onClick={() => setActive(index)}
              className={`
                group relative
                ${card.color}
                rounded-3xl text-white cursor-pointer shadow-lg md:shadow-xl
                flex flex-col justify-between
                transition-all duration-1000 ease-out
                hover:shadow-2xl
                ${
                  isActive
                    ? "flex-[2.4] md:flex-[2.6] scale-100"
                    : "flex-1 scale-[0.97] md:scale-[0.96]"
                }
              `}
            >
              <div className="p-7 md:p-9 lg:p-12">
                <Icon
                  size={isActive ? 48 : 38}
                  className="mb-5 md:mb-6 transition-all duration-700"
                />

                <h3
                  className={`
                    font-bold leading-tight transition-all duration-700
                    ${isActive ? "text-2xl md:text-3xl mb-5" : "text-xl mb-3"}
                  `}
                >
                  {card.title}
                </h3>

                <div
                  className={`
                    transition-all duration-900 ease-out origin-top
                    ${
                      isActive
                        ? "max-h-64 opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-2"
                    }
                  `}
                >
                  <p className="text-base md:text-lg leading-relaxed tracking-wide">
                    {card.description}
                  </p>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
