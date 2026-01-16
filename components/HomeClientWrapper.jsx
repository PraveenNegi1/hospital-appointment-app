"use client";

import { useAuth } from '../lib/authContext';
import UserAppointments from './UserAppointments';

export default function HomeClientContent() {
  const { user, role } = useAuth();

  return (
    <>
      {user && role === 'user' && <UserAppointments />}
    </>
  );
}