'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="bg-white text-teal-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">HospitalApp</Link>
        <div className="space-x-4">
          {user ? (
            <>
              <button onClick={handleLogout} className="bg-white cursor-pointer  text-red-600 border border-red-600 hover:bg-red-600 hover:text-white shadow px-4 py-2 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}