"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthDomainHelper() {
  const [showHelper, setShowHelper] = useState(false)
  const [currentDomain, setCurrentDomain] = useState("")

  useEffect(() => {
    // Only show in development or preview environments
    const hostname = window.location.hostname
    const isDevelopmentOrPreview =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes("vercel.app") ||
      hostname.includes(".preview.")

    setShowHelper(isDevelopmentOrPreview)
    setCurrentDomain(window.location.origin)
  }, [])

  if (!showHelper) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 flex justify-between">
          <span>Google Authentication Setup</span>
          <button
            onClick={() => setShowHelper(false)}
            className="text-amber-600 hover:text-amber-800"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </AlertTitle>
        <AlertDescription className="text-amber-700">
          <p className="mb-2">To enable Google sign-in, add this domain to your Firebase project:</p>
          <code className="bg-amber-100 px-2 py-1 rounded text-xs block mb-3 overflow-x-auto">{currentDomain}</code>
          <p className="text-xs mb-2">
            Go to Firebase Console &gt; Authentication &gt; Sign-in method &gt; Authorized domains
          </p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-amber-600 text-amber-700 hover:bg-amber-100 w-full"
            onClick={() => window.open("https://console.firebase.google.com/", "_blank")}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open Firebase Console
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
