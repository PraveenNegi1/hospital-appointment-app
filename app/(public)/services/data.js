import { Ambulance, HeartPulse, Brain, Baby } from "lucide-react";

export const servicesData = [
  {
    slug: "emergency-care",
    title: "Emergency Care",
    shortDesc: "24/7 emergency medical services with rapid response.",
    icon: Ambulance,
    points: ["24/7 Availability", "ICU Support", "Rapid Response"],

    content: {
      overview:
        "Our Emergency Care department operates round-the-clock to provide immediate medical attention in life-threatening situations. We are equipped with advanced infrastructure and an experienced emergency response team to ensure timely and effective care.",

      treatments: [
        "Trauma & accident care",
        "Cardiac emergencies",
        "Respiratory distress management",
        "Stroke and neurological emergencies",
        "Poisoning & overdose treatment",
      ],

      facilities: [
        "24/7 Emergency Room",
        "Advanced ICU Units",
        "Emergency Operation Theatres",
        "Fully equipped ambulances",
        "Trauma care center",
      ],

      doctors: [
        "Emergency Physicians",
        "Critical Care Specialists",
        "Trauma Surgeons",
        "Anesthesiologists",
      ],

      faqs: [
        {
          q: "Is emergency service available 24/7?",
          a: "Yes, our emergency department is open 24 hours a day, 7 days a week.",
        },
        {
          q: "Do you provide ambulance services?",
          a: "Yes, we have fully equipped ambulances with trained paramedics.",
        },
      ],
    },
  },

  {
    slug: "cardiology",
    title: "Cardiology",
    shortDesc: "Advanced heart care, diagnostics, and surgical treatments.",
    icon: HeartPulse,
    points: ["ECG & Echo", "Heart Surgery", "Preventive Care"],

    content: {
      overview:
        "Our Cardiology department provides comprehensive care for heart-related conditions using state-of-the-art diagnostic tools and evidence-based treatment plans.",

      treatments: [
        "ECG, Echo & Stress Testing",
        "Angiography & Angioplasty",
        "Heart valve disorders",
        "Heart failure management",
        "Preventive cardiology",
      ],

      facilities: [
        "Modern Cath Lab",
        "Advanced Cardiac ICU",
        "Non-invasive diagnostics",
        "24/7 cardiac emergency support",
      ],

      doctors: [
        "Interventional Cardiologists",
        "Cardiac Surgeons",
        "Cardiac Anesthetists",
      ],

      faqs: [
        {
          q: "Do you offer preventive heart checkups?",
          a: "Yes, we provide comprehensive heart health screening packages.",
        },
        {
          q: "Is open-heart surgery available?",
          a: "Yes, our hospital performs advanced cardiac surgeries.",
        },
      ],
    },
  },

  {
    slug: "neurology",
    title: "Neurology",
    shortDesc:
      "Specialized care for brain, spine, and nervous system disorders.",
    icon: Brain,
    points: ["Stroke Care", "Neuro Imaging", "Expert Neurologists"],

    content: {
      overview:
        "Our Neurology department focuses on diagnosing and treating complex neurological disorders with precision and care.",

      treatments: [
        "Stroke management",
        "Epilepsy treatment",
        "Parkinson’s disease care",
        "Multiple sclerosis management",
        "Headache & migraine treatment",
      ],

      facilities: [
        "MRI & CT Scan",
        "Neuro ICU",
        "EEG & EMG labs",
        "Advanced neuro imaging",
      ],

      doctors: [
        "Neurologists",
        "Neurosurgeons",
        "Neurocritical care specialists",
      ],

      faqs: [
        {
          q: "Do you have a stroke emergency unit?",
          a: "Yes, we provide rapid-response stroke care services.",
        },
        {
          q: "Are neuro surgeries performed here?",
          a: "Yes, our neurosurgeons perform advanced brain and spine surgeries.",
        },
      ],
    },
  },

  {
    slug: "pediatrics",
    title: "Pediatrics",
    shortDesc: "Comprehensive healthcare services for infants and children.",
    icon: Baby,
    points: ["Vaccinations", "Growth Monitoring", "Child Specialists"],

    content: {
      overview:
        "Our Pediatrics department delivers compassionate, family-centered care for children from birth through adolescence.",

      treatments: [
        "Newborn & infant care",
        "Vaccinations & immunization",
        "Growth & developmental monitoring",
        "Childhood infections",
        "Nutritional counseling",
      ],

      facilities: [
        "NICU & PICU",
        "Child-friendly wards",
        "Vaccination unit",
        "Neonatal monitoring systems",
      ],

      doctors: ["Pediatricians", "Neonatologists", "Pediatric Surgeons"],

      faqs: [
        {
          q: "Do you provide newborn intensive care?",
          a: "Yes, our NICU is fully equipped for newborn care.",
        },
        {
          q: "Is vaccination available for all age groups?",
          a: "Yes, we provide a complete immunization schedule for children.",
        },
      ],
    },
  },
];
