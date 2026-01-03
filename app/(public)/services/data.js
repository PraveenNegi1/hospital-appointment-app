import { 
  Ambulance, 
  HeartPulse, 
  Brain, 
  Baby, 
  Stethoscope, 
  Dna, 
  Microscope, 
  Bone, 
  Eye, 
  Ear, 
  Scissors, 
  LucideParkingSquare
} from "lucide-react";

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
    slug: "Cardiologist",
    title: "Cardiologist",
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
    shortDesc: "Specialized care for brain, spine, and nervous system disorders.",
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

  // ── NEW SERVICES ───────────────────────────────────────────────────────

  {
    slug: "orthopedics",
    title: "Orthopedics",
    shortDesc: "Expert care for bones, joints, muscles, and sports injuries.",
    icon: Bone,
    points: ["Joint Replacement", "Fracture Care", "Arthroscopy"],

    content: {
      overview:
        "Our Orthopedics department specializes in the diagnosis, treatment, and rehabilitation of musculoskeletal conditions, helping patients regain mobility and function.",

      treatments: [
        "Joint replacement (knee, hip, shoulder)",
        "Fracture management",
        "Arthroscopic surgery",
        "Spine surgery",
        "Sports injury treatment",
      ],

      facilities: [
        "Advanced Operation Theatres",
        "Digital X-ray & Fluoroscopy",
        "Physiotherapy & Rehabilitation Center",
        "Plaster & Casting Room",
      ],

      doctors: [
        "Orthopedic Surgeons",
        "Joint Replacement Specialists",
        "Spine Surgeons",
        "Sports Medicine Experts",
      ],

      faqs: [
        {
          q: "Do you perform knee replacement surgery?",
          a: "Yes, we offer both total and partial knee replacement procedures.",
        },
        {
          q: "Is physiotherapy available after surgery?",
          a: "Yes, we have an in-house physiotherapy team for post-operative rehabilitation.",
        },
      ],
    },
  },

  {
    slug: "obstetrics-gynecology",
    title: "Obstetrics & Gynecology",
    shortDesc: "Complete care for women's health, pregnancy, and childbirth.",
    icon: Stethoscope,
    points: ["Normal & C-Section Delivery", "High-Risk Pregnancy", "Laparoscopic Surgery"],

    content: {
      overview:
        "Our Obstetrics & Gynecology department provides comprehensive care for women at every stage of life, from routine check-ups to high-risk pregnancies and advanced gynecological surgeries.",

      treatments: [
        "Normal & cesarean deliveries",
        "High-risk pregnancy management",
        "Laparoscopic gynecological surgery",
        "Infertility evaluation & treatment",
        "Menopause care",
      ],

      facilities: [
        "Labor & Delivery Suites",
        "Modern Operation Theatres",
        "Level III NICU",
        "Ultrasound & Fetal Monitoring",
      ],

      doctors: [
        "Obstetricians & Gynecologists",
        "Fetal Medicine Specialists",
        "Laparoscopic Surgeons",
        "Infertility Specialists",
      ],

      faqs: [
        {
          q: "Do you have facilities for high-risk pregnancies?",
          a: "Yes, we have a dedicated high-risk pregnancy unit with fetal medicine experts.",
        },
        {
          q: "Is painless delivery available?",
          a: "Yes, we offer epidural analgesia for painless labor.",
        },
      ],
    },
  },

  {
    slug: "pulmonology",
    title: "Pulmonology",
    shortDesc: "Specialized care for lung and respiratory conditions.",
    icon: LucideParkingSquare,
    points: ["Asthma Management", "COPD Care", "Sleep Studies"],

    content: {
      overview:
        "Our Pulmonology department offers advanced diagnosis and treatment for a wide range of respiratory disorders, helping patients breathe easier.",

      treatments: [
        "Asthma & allergy management",
        "COPD & chronic bronchitis",
        "Pneumonia treatment",
        "Tuberculosis management",
        "Sleep apnea diagnosis & treatment",
      ],

      facilities: [
        "Pulmonary Function Test Lab",
        "Sleep Study Lab",
        "Bronchoscopy Suite",
        "Respiratory ICU",
      ],

      doctors: [
        "Pulmonologists",
        "Sleep Medicine Specialists",
        "Critical Care Pulmonologists",
      ],

      faqs: [
        {
          q: "Do you treat sleep apnea?",
          a: "Yes, we conduct sleep studies and provide CPAP/BiPAP therapy.",
        },
        {
          q: "Is bronchoscopy available?",
          a: "Yes, we perform diagnostic and therapeutic bronchoscopy procedures.",
        },
      ],
    },
  },

  {
    slug: "oncology",
    title: "Oncology",
    shortDesc: "Comprehensive cancer care with advanced treatment options.",
    icon: Dna,
    points: ["Chemotherapy", "Radiation Therapy", "Cancer Surgery"],

    content: {
      overview:
        "Our Oncology department provides multidisciplinary cancer care, combining medical, surgical, and radiation oncology for the best possible outcomes.",

      treatments: [
        "Chemotherapy",
        "Radiation therapy",
        "Surgical oncology",
        "Targeted therapy & immunotherapy",
        "Palliative care",
      ],

      facilities: [
        "Linear Accelerator",
        "Chemotherapy Day Care Unit",
        "Bone Marrow Transplant Unit",
        "Tumor Board Meetings",
      ],

      doctors: [
        "Medical Oncologists",
        "Surgical Oncologists",
        "Radiation Oncologists",
        "Palliative Care Specialists",
      ],

      faqs: [
        {
          q: "Do you offer immunotherapy?",
          a: "Yes, we provide the latest immunotherapy treatments for eligible cancers.",
        },
        {
          q: "Is there a dedicated cancer ward?",
          a: "Yes, we have specialized oncology wards and day care facilities.",
        },
      ],
    },
  },

  {
    slug: "ophthalmology",
    title: "Ophthalmology",
    shortDesc: "Advanced eye care, cataract surgery, and vision correction.",
    icon: Eye,
    points: ["Cataract Surgery", "Laser Vision Correction", "Retina Services"],

    content: {
      overview:
        "Our Ophthalmology department delivers comprehensive eye care, from routine eye exams to complex retinal surgeries and vision correction procedures.",

      treatments: [
        "Cataract surgery (phacoemulsification)",
        "LASIK & other refractive surgeries",
        "Retina & vitreoretinal surgery",
        "Glaucoma management",
        "Cornea transplant",
      ],

      facilities: [
        "State-of-the-art Operation Theatres",
        "Optical Coherence Tomography (OCT)",
        "Fundus Camera & Fluorescein Angiography",
        "YAG & Green Laser",
      ],

      doctors: [
        "Ophthalmologists",
        "Retina Specialists",
        "Cornea Specialists",
        "Glaucoma Specialists",
      ],

      faqs: [
        {
          q: "Do you perform LASIK surgery?",
          a: "Yes, we offer LASIK and other laser vision correction procedures.",
        },
        {
          q: "Is cataract surgery done with laser?",
          a: "Yes, we provide both conventional and femtosecond laser-assisted cataract surgery.",
        },
      ],
    },
  },

  {
    slug: "general-surgery",
    title: "General Surgery",
    shortDesc: "Expert surgical care for a wide range of conditions.",
    icon: Scissors,
    points: ["Laparoscopic Surgery", "Hernia Repair", "Gallbladder Surgery"],

    content: {
      overview:
        "Our General Surgery department handles both elective and emergency surgical procedures using minimally invasive and traditional techniques.",

      treatments: [
        "Laparoscopic (keyhole) surgery",
        "Hernia repair (open & laparoscopic)",
        "Appendectomy & cholecystectomy",
        "Breast surgery",
        "Thyroid & parathyroid surgery",
      ],

      facilities: [
        "Modular Operation Theatres",
        "Laparoscopic & Endoscopic Equipment",
        "Post-operative Recovery Unit",
        "Day Care Surgery Unit",
      ],

      doctors: [
        "General & Laparoscopic Surgeons",
        "Breast Surgeons",
        "Endocrine Surgeons",
      ],

      faqs: [
        {
          q: "Do you perform laparoscopic surgeries?",
          a: "Yes, most abdominal surgeries are performed laparoscopically when possible.",
        },
        {
          q: "Is day care surgery available?",
          a: "Yes, we offer day care surgery for suitable procedures like hernia repair and piles surgery.",
        },
      ],
    },
  },
];