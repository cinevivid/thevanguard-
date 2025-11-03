import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export const getFirebaseDb = (): Firestore | null => {
    if (db) return db;

    const firebaseConfigStr = localStorage.getItem('firebaseConfig');
    if (!firebaseConfigStr) {
        console.warn("Firebase config not found in localStorage. Database operations will be disabled. Please set it on the API Keys page.");
        return null;
    }

    try {
        const firebaseConfig = JSON.parse(firebaseConfigStr);
        if (!app) {
          app = initializeApp(firebaseConfig);
        }
        db = getFirestore(app);
        return db;
    } catch(e) {
        console.error("Error initializing Firebase:", e);
        return null;
    }
}

export const setFirebaseConfig = (config: string) => {
    localStorage.setItem('firebaseConfig', config);
    // Invalidate current instances to force re-initialization on next call
    app = null;
    db = null;
}
