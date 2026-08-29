import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { UserProfile, BusinessInput, WordPressTheme, DeploymentRecord } from "../types";

// Firebase configuration with environment variables or fallback values
const metaEnv = (import.meta as any)?.env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForStudioPreviewEnv2026",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "ai-digital-factory-preview.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "ai-digital-factory-preview",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "ai-digital-factory-preview.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "825729347984",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:825729347984:web:9fa42de61129"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isFirebaseAvailable = false;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
  isFirebaseAvailable = true;
} catch (err) {
  console.warn("Firebase initialization warning (using local fallback engine):", err);
  isFirebaseAvailable = false;
}

export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<UserProfile> {
  if (auth && isFirebaseAvailable) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || "architect@aidigitalfactory.dev",
        displayName: user.displayName || "Autonomous Architect",
        photoURL: user.photoURL || undefined,
        plan: "Enterprise",
        role: "admin",
        totalSitesQuota: 100
      };
      localStorage.setItem("adf_user_profile", JSON.stringify(profile));
      return profile;
    } catch (err: any) {
      console.warn("Firebase popup sign-in fallback:", err);
    }
  }

  // Graceful fallback profile
  const fallbackUser: UserProfile = {
    uid: "usr_factory_architect_2026",
    email: "architect@aidigitalfactory.dev",
    displayName: "Lead Systems Architect",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    plan: "Enterprise",
    role: "admin",
    totalSitesQuota: 100
  };
  localStorage.setItem("adf_user_profile", JSON.stringify(fallbackUser));
  return fallbackUser;
}

export async function signInWithEmail(email: string, password: string): Promise<UserProfile> {
  if (auth && isFirebaseAvailable) {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || email.split("@")[0],
        role: "admin",
        plan: "Enterprise"
      };
      localStorage.setItem("adf_user_profile", JSON.stringify(profile));
      return profile;
    } catch (err: any) {
      console.warn("Firebase email signin fallback:", err);
    }
  }

  const localUser: UserProfile = {
    uid: `usr_${Date.now()}`,
    email: email,
    displayName: email.split("@")[0],
    role: "admin",
    plan: "Enterprise"
  };
  localStorage.setItem("adf_user_profile", JSON.stringify(localUser));
  return localUser;
}

export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<UserProfile> {
  if (auth && isFirebaseAvailable) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        displayName: displayName || user.displayName || email.split("@")[0],
        role: "admin",
        plan: "Enterprise"
      };
      localStorage.setItem("adf_user_profile", JSON.stringify(profile));
      return profile;
    } catch (err: any) {
      console.warn("Firebase email signup fallback:", err);
    }
  }

  const localUser: UserProfile = {
    uid: `usr_${Date.now()}`,
    email: email,
    displayName: displayName || email.split("@")[0],
    role: "admin",
    plan: "Enterprise"
  };
  localStorage.setItem("adf_user_profile", JSON.stringify(localUser));
  return localUser;
}

export async function signOutUser(): Promise<void> {
  if (auth && isFirebaseAvailable) {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn(e);
    }
  }
  localStorage.removeItem("adf_user_profile");
}

export function getCurrentStoredUser(): UserProfile {
  const stored = localStorage.getItem("adf_user_profile");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return {
    uid: "usr_lead_architect_2026",
    email: "architect@aidigitalfactory.dev",
    displayName: "Lead Systems Architect",
    role: "admin",
    plan: "Enterprise",
    totalSitesQuota: 100
  };
}

export async function saveBusinessToCloud(business: BusinessInput, userId: string): Promise<void> {
  if (db && isFirebaseAvailable && userId) {
    try {
      await setDoc(doc(db, `users/${userId}/businesses`, business.id), business);
    } catch (e) {
      console.warn("Firestore save fallback to localStorage:", e);
    }
  }
  // Also save to localStorage
  const existing = getSavedBusinessesFromLocal();
  const index = existing.findIndex(b => b.id === business.id);
  if (index >= 0) {
    existing[index] = business;
  } else {
    existing.unshift(business);
  }
  localStorage.setItem("adf_saved_businesses", JSON.stringify(existing));
}

export function getSavedBusinessesFromLocal(): BusinessInput[] {
  const raw = localStorage.getItem("adf_saved_businesses");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return [];
}
