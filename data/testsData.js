import {
  FaTint,
  FaXRay,
  FaHeartbeat,
  FaMicroscope,
  FaVirus,
} from "react-icons/fa";
import { MdOutlineBloodtype, MdHealthAndSafety } from "react-icons/md";
import { GiHeartOrgan } from "react-icons/gi";
import { TbScan } from "react-icons/tb";
import { BsSoundwave } from "react-icons/bs";

export const testsData = [
  {
    slug: "blood-test",
    title: "Blood Test",
    icon: MdOutlineBloodtype,
    department: "Pathology",
    shortDescription: "Complete blood analysis for overall health.",
    fullDescription:
      "Blood tests help evaluate your overall health and detect disorders like anemia, infection, diabetes, liver and kidney diseases.",
    sampleType: "Blood sample",
    preparation: "Fasting may be required for 8–12 hours.",
    duration: "10–15 minutes",
    reportTime: "Same day or within 24 hours",
    price: "₹500",
    ageGroup: "All age groups",
    whoShouldTake:
      "People with fatigue, weakness, fever, chronic illness, or for routine health checkups.",
    normalRange: "Hemoglobin: 12–16 g/dL (female), 13–17 g/dL (male)",
    risks: "Minimal discomfort at needle site",
    followUp: "Doctor consultation recommended if values are abnormal.",
  },

  {
    slug: "x-ray",
    title: "X-Ray",
    icon: FaXRay,
    department: "Radiology",
    shortDescription: "Digital X-ray imaging for bones and chest.",
    fullDescription:
      "X-rays use controlled radiation to capture images of bones and organs to diagnose fractures, infections, or lung diseases.",
    sampleType: "Imaging",
    preparation: "Remove metal objects.",
    duration: "5–10 minutes",
    reportTime: "Same day",
    price: "₹800",
    ageGroup: "Adults & children",
    whoShouldTake:
      "Patients with injury, bone pain, chest infection, or breathing issues.",
    risks: "Low radiation exposure",
    followUp: "Further imaging or orthopedic consultation if required.",
  },

  {
    slug: "mri-scan",
    title: "MRI Scan",
    icon: TbScan,
    department: "Radiology",
    shortDescription: "Advanced MRI imaging for soft tissues.",
    fullDescription:
      "MRI uses strong magnetic fields and radio waves to produce detailed images of organs, brain, spine, and joints.",
    sampleType: "Imaging",
    preparation: "Remove metal objects. Inform doctor if pregnant.",
    duration: "30–45 minutes",
    reportTime: "24–48 hours",
    price: "₹4500",
    ageGroup: "Adults",
    whoShouldTake:
      "Patients with neurological issues, joint pain, spine problems.",
    risks: "Not suitable for patients with pacemakers or metal implants.",
    followUp: "Specialist consultation based on MRI findings.",
  },

  {
    slug: "ct-scan",
    title: "CT Scan",
    icon: FaMicroscope,
    department: "Radiology",
    shortDescription: "High-resolution CT scan diagnostics.",
    fullDescription:
      "CT scans combine X-ray images to create cross-sectional views of bones, blood vessels, and soft tissues.",
    sampleType: "Imaging",
    preparation: "Fasting required if contrast dye is used.",
    duration: "15–30 minutes",
    reportTime: "24 hours",
    price: "₹3500",
    ageGroup: "Adults",
    whoShouldTake: "Patients with trauma, tumors, internal injuries.",
    risks: "Moderate radiation exposure",
    followUp: "Doctor review needed for abnormal findings.",
  },

  {
    slug: "ultrasound",
    title: "Ultrasound",
    icon: BsSoundwave,
    department: "Radiology",
    shortDescription: "Safe ultrasound imaging using sound waves.",
    fullDescription:
      "Ultrasound uses sound waves to visualize organs, pregnancy, abdomen, pelvis, and thyroid.",
    sampleType: "Imaging",
    preparation: "Full bladder may be required.",
    duration: "15–30 minutes",
    reportTime: "Same day",
    price: "₹1200",
    ageGroup: "All age groups",
    whoShouldTake:
      "Pregnant women, abdominal pain, liver or kidney evaluation.",
    risks: "No known risks",
    followUp: "Gynecologist or physician consultation if needed.",
  },

  {
    slug: "ecg",
    title: "ECG",
    icon: FaHeartbeat,
    department: "Cardiology",
    shortDescription: "Heart rhythm and electrical activity test.",
    fullDescription:
      "ECG records heart electrical signals to detect heart attacks, arrhythmias, and heart disease.",
    sampleType: "Electrical recording",
    preparation: "No special preparation required.",
    duration: "5–10 minutes",
    reportTime: "Same day",
    price: "₹600",
    ageGroup: "Adults & elderly",
    whoShouldTake: "Chest pain, dizziness, high BP, or heart patients.",
    risks: "No risks",
    followUp: "Cardiologist consultation recommended.",
  },

  {
    slug: "echo",
    title: "Echocardiography",
    icon: GiHeartOrgan,
    department: "Cardiology",
    shortDescription: "Detailed ultrasound imaging of the heart.",
    fullDescription:
      "Echo uses sound waves to assess heart chambers, valves, and pumping function.",
    sampleType: "Imaging",
    preparation: "No special preparation required.",
    duration: "30–40 minutes",
    reportTime: "Same day",
    price: "₹2500",
    ageGroup: "Adults",
    whoShouldTake: "Patients with heart murmur, heart failure, or chest pain.",
    risks: "No known risks",
    followUp: "Cardiology review based on results.",
  },

  {
    slug: "urine-test",
    title: "Urine Test",
    icon: FaTint,
    department: "Pathology",
    shortDescription: "Routine urine analysis.",
    fullDescription:
      "Urine tests help detect infections, kidney diseases, diabetes, and dehydration.",
    sampleType: "Urine sample",
    preparation: "Early morning sample preferred.",
    duration: "5 minutes",
    reportTime: "Same day",
    price: "₹300",
    ageGroup: "All age groups",
    whoShouldTake: "Burning urination, abdominal pain, routine checkups.",
    risks: "No risks",
    followUp: "Doctor consultation if abnormal values found.",
  },

  {
    slug: "thyroid-test",
    title: "Thyroid Profile",
    icon: MdHealthAndSafety,
    department: "Endocrinology",
    shortDescription: "Thyroid hormone level testing.",
    fullDescription:
      "Measures T3, T4, and TSH to diagnose hypo or hyperthyroidism.",
    sampleType: "Blood sample",
    preparation: "No fasting required.",
    duration: "10 minutes",
    reportTime: "24 hours",
    price: "₹700",
    ageGroup: "Adults",
    whoShouldTake: "Weight changes, hair fall, fatigue, irregular periods.",
    risks: "Minimal discomfort",
    followUp: "Endocrinologist consultation recommended.",
  },

  {
    slug: "covid-rtpcr",
    title: "COVID-19 RT-PCR",
    icon: FaVirus,
    department: "Microbiology",
    shortDescription: "COVID-19 detection test.",
    fullDescription:
      "RT-PCR detects COVID-19 infection accurately using nasal or throat swab.",
    sampleType: "Nasal/Throat swab",
    preparation: "No special preparation required.",
    duration: "5 minutes",
    reportTime: "24 hours",
    price: "₹1200",
    ageGroup: "All age groups",
    whoShouldTake: "Fever, cough, travel history, or exposure cases.",
    risks: "Mild discomfort during swab",
    followUp: "Isolation and doctor guidance if positive.",
  },
];
