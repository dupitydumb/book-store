import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, enableIndexedDbPersistence, type Firestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

// Check if Firebase config is properly set
const validateFirebaseConfig = () => {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  )
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
let app
let db: any
let auth: any
let storage

try {
  if (!validateFirebaseConfig()) {
    throw new Error("Invalid Firebase configuration")
  }

  // Initialize Firebase app
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

  // Initialize Firestore
  db = getFirestore(app)

  // Initialize Auth and Storage
  auth = getAuth(app)
  storage = getStorage(app)

  // Only attempt to enable persistence in client-side code
  if (typeof window !== "undefined") {
    // We'll use a separate function to handle persistence
    // This will be called only once when needed
    console.log("Firebase initialized successfully")
  }
} catch (error) {
  console.error("Firebase initialization error:", error)

  // Create fallback instances to prevent app crashes
  if (!app) app = getApps().length ? getApp() : initializeApp({ projectId: "fallback-project" })
  if (!db) db = getFirestore(app)
  if (!auth) auth = getAuth(app)
  if (!storage) storage = getStorage(app)
}

// Separate function to enable persistence that can be called when needed
// This should only be called once and only on the client side
let persistenceEnabled = false
export async function enableFirestorePersistence(): Promise<boolean> {
  // Only run on client side and only once
  if (typeof window === "undefined" || persistenceEnabled) {
    return persistenceEnabled
  }

  try {
    await enableIndexedDbPersistence(db)
    persistenceEnabled = true
    console.log("Firestore persistence enabled successfully")
    return true
  } catch (err: any) {
    if (err.code === "failed-precondition") {
      console.warn("Firestore persistence could not be enabled. Multiple tabs open?")
    } else if (err.code === "unimplemented") {
      console.warn("Browser does not support IndexedDB persistence")
    } else {
      console.error("Error enabling Firestore persistence:", err)
    }
    return false
  }
}

export { app, db, auth, storage }
