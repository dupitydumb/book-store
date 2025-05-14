"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useFirebase } from "@/lib/firebase/context/FirebaseContext"
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  logOut,
} from "@/lib/firebase/services/authService"

export function useAuth() {
  const { user, userData, loading } = useFirebase()
  const [authLoading, setAuthLoading] = useState(false)
  const router = useRouter()

  // Sign in with Google
  const loginWithGoogle = async (redirectTo?: string) => {
    setAuthLoading(true)
    try {
      await signInWithGoogle()
      toast.success("Welcome!", {
        description: "You have successfully signed in with Google.",
      })
      if (redirectTo) {
        router.push(redirectTo)
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error)

      // Check for specific error types
      if (error.code === "auth/unauthorized-domain") {
        toast.error("Domain Not Authorized", {
          description:
            "This domain is not authorized for Google sign-in. Please use email/password instead or add this domain in Firebase Console.",
        })
      } else {
        toast.error("Sign-in Failed", {
          description: error instanceof Error ? error.message : "Failed to sign in with Google",
        })
      }
    } finally {
      setAuthLoading(false)
    }
  }

  // Sign in with email/password
  const login = async (email: string, password: string, redirectTo?: string) => {
    setAuthLoading(true)
    try {
      await signInWithEmail(email, password)
      toast.success("Welcome back!", {
        description: "You have successfully signed in.",
      })
      if (redirectTo) {
        router.push(redirectTo)
      }
    } catch (error) {
      console.error("Email sign-in error:", error)
      toast.error("Sign-in Failed", {
        description: error instanceof Error ? error.message : "Invalid email or password",
      })
    } finally {
      setAuthLoading(false)
    }
  }

  // Sign up with email/password
  const signup = async (email: string, password: string, displayName: string, redirectTo?: string) => {
    setAuthLoading(true)
    try {
      await signUpWithEmail(email, password, displayName)
      toast.success("Account Created", {
        description: "Your account has been successfully created.",
      })
      if (redirectTo) {
        router.push(redirectTo)
      }
    } catch (error) {
      console.error("Sign-up error:", error)
      toast.error("Sign-up Failed", {
        description: error instanceof Error ? error.message : "Failed to create account",
      })
    } finally {
      setAuthLoading(false)
    }
  }

  // Password reset
  const forgotPassword = async (email: string) => {
    setAuthLoading(true)
    try {
      await resetPassword(email)
      toast.success("Password Reset Email Sent", {
        description: "Check your email for a link to reset your password.",
      })
    } catch (error) {
      console.error("Password reset error:", error)
      toast.error("Password Reset Failed", {
        description: error instanceof Error ? error.message : "Failed to send password reset email",
      })
    } finally {
      setAuthLoading(false)
    }
  }

  // Sign out
  const logout = async (redirectTo?: string) => {
    setAuthLoading(true)
    try {
      await logOut()
      toast.success("Signed Out", {
        description: "You have been successfully signed out.",
      })
      if (redirectTo) {
        router.push(redirectTo)
      }
    } catch (error) {
      console.error("Sign-out error:", error)
      toast.error("Sign-out Failed", {
        description: error instanceof Error ? error.message : "Failed to sign out",
      })
    } finally {
      setAuthLoading(false)
    }
  }

  return {
    user,
    userData,
    isAdmin: userData?.role === "admin",
    loading: loading || authLoading,
    loginWithGoogle,
    login,
    signup,
    forgotPassword,
    logout,
  }
}
