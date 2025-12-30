'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import HospitalHero from '@/components/Hero';
import Services from '@/components/Services';
import Doctors from '@/components/Doctors';
import SpecialtyGrid from '@/components/SpecialtyGrid';

export default function Home() {
 

  return (
    <div>
      <HospitalHero />
      <Services />
      <SpecialtyGrid />
    </div>
  );
}