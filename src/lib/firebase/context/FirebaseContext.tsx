"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../config"
import { enableFirestorePersistence } from "../config"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../config"

interface UserData {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  role: string
  createdAt?: any
}

interface FirebaseContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  persistenceEnabled: boolean
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  userData: null,
  loading: true,
  persistenceEnabled: false,
})

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [persistenceEnabled, setPersistenceEnabled] = useState(false)

  useEffect(() => {
    // Handle authentication state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      // If user is logged in, fetch additional user data from Firestore
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid)
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            setUserData(userSnap.data() as UserData)
          } else {
            console.log("No user data found in Firestore")
            // Use basic data from auth
            setUserData({
              uid: user.uid,
              displayName: user.displayName || "User",
              email: user.email || "",
              photoURL: user.photoURL || undefined,
              role: "customer",
            })
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    // Try to enable persistence only once on initial load
    const setupPersistence = async () => {
      const result = await enableFirestorePersistence()
      setPersistenceEnabled(result)
    }

    setupPersistence()

    return () => unsubscribe()
  }, [])

  return (
    <FirebaseContext.Provider value={{ user, userData, loading, persistenceEnabled }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = () => useContext(FirebaseContext)
