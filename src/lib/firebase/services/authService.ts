import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../config"

// Google Sign-in
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: "select_account" })
    const result = await signInWithPopup(auth, provider)

    // Check if this is a new user and create a profile if needed
    await createUserProfileIfNeeded(result.user)

    return result
  } catch (error: any) {
    console.error("Error signing in with Google:", error)

    // Check for unauthorized domain error
    if (error.code === "auth/unauthorized-domain") {
      const currentDomain = window.location.hostname
      error.message = `This domain (${currentDomain}) is not authorized for Google authentication. Please add it to your Firebase Console under Authentication > Sign-in method > Authorized domains.`
    }

    throw error
  }
}

// Email/Password Sign-in
export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.error("Error signing in with email/password:", error)
    throw error
  }
}

// Email/Password Sign-up
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string,
): Promise<UserCredential> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    // Update profile with display name
    await updateProfile(result.user, { displayName })

    // Create user profile in Firestore
    await createUserProfileIfNeeded(result.user)

    return result
  } catch (error) {
    console.error("Error signing up with email/password:", error)
    throw error
  }
}

// Password Reset
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw error
  }
}

// Sign Out
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

// Create user profile in Firestore if it doesn't exist
export const createUserProfileIfNeeded = async (user: User): Promise<void> => {
  if (!user.uid) return

  try {
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      // Create new user profile
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || "User",
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        role: "customer", // Default role
      })
      console.log("User profile created successfully")
    } else {
      // Update last login
      await setDoc(userRef, { updatedAt: serverTimestamp() }, { merge: true })
    }
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}
