'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          if (role === 'patient') router.push('/dashboard/patient');
          else if (role === 'doctor') router.push('/dashboard/doctor');
          else if (role === 'admin') router.push('/dashboard/admin');
          else router.push('/dashboard/patient');
        }
      } else {
        router.push('/login');
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">Redirecting to your dashboard...</p>
    </div>
  );
}