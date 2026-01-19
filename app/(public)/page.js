import HospitalHero from "@/components/Hero";
import HomeClientContent from "@/components/HomeClientWrapper";
import HospitalTestCard from "@/components/HospitalTestCard";
import Services from "@/components/Services";

export default function Home() {
  return (
    <div>
      <HospitalHero />
      <Services />
      <HomeClientContent />
      <HospitalTestCard />
    </div>
  );
} 