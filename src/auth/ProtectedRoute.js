// src/auth/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase/config';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function ProtectedRoute({ children, allowedRole }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const role = userSnap.exists() ? userSnap.data().role : null;

      if (role !== allowedRole) {
        router.push('/login'); // atau tampilkan halaman tidak punya akses
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
