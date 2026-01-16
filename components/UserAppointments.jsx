'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/authContext';

export default function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      const q = query(collection(db, 'appointments'), where('userId', '==', user.uid), where('status', '==', 'approved'));
      const querySnapshot = await getDocs(q);
      setAppointments(querySnapshot.docs.map(d => d.data()));
    };
    if (user) fetchAppointments();
  }, [user]);

  return (
    <div>
      <h2>Your Confirmed Appointments</h2>
      {appointments.map((appt, idx) => (
        <div key={idx}>
          <p>Doctor ID: {appt.doctorId} - Details: {JSON.stringify(appt.details)}</p>
        </div>
      ))}
    </div>
  );
}