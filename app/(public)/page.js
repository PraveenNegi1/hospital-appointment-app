import HealthcareImpact from "@/components/HealthcareImpact";
import HospitalHero from "@/components/Hero";
import HospitalTests from "@/components/HospitalTests";
import Services from "@/components/Services";

export default function Home() {
  return (
    <div>
      <HospitalHero />
      <Services />
       <HospitalTests />
       <HealthcareImpact />
     
    </div>
  );
} 