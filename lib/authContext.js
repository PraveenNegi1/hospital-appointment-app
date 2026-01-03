// lib/authContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check auto-logout after 2 days
        const loginTime = localStorage.getItem("loginTime");
        if (loginTime) {
          const daysSinceLogin = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60 * 24);
          if (daysSinceLogin > 2) {
            await signOut(auth);
            localStorage.clear();
            setUser(null);
            setLoading(false);
            return;
          }
        }

        // Fetch fresh user data from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const name = userData.name || "User";
          const role = userData.role || "patient";

          // Save to localStorage for quick access
          localStorage.setItem("userName", name);
          localStorage.setItem("userRole", role);
          localStorage.setItem("loginTime", Date.now().toString());

          setUser({
            uid: currentUser.uid,
            name,
            email: currentUser.email,
            role,
          });
        } else {
          // No profile → logout
          await signOut(auth);
          localStorage.clear();
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.clear();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);