"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, X } from "lucide-react"
import { checkFirestoreConnection } from "@/lib/firebase/utils/connection-checker"
import Link from "next/link"

export default function FallbackDataNotice() {
  const [showNotice, setShowNotice] = useState(false)
  const [connectionChecked, setConnectionChecked] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      const connectionStatus = await checkFirestoreConnection()
      setShowNotice(!connectionStatus.connected)
      setConnectionChecked(true)
    }

    checkConnection()
  }, [])

  if (!connectionChecked || !showNotice) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant="warning" className="border-yellow-500 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Using Demo Data</AlertTitle>
        <AlertDescription className="text-yellow-700">
          <p>
            We're currently showing demo data because we couldn't connect to Firebase. Check your{" "}
            <Link href="/firebase-status" className="font-medium text-yellow-800 underline">
              Firebase connection
            </Link>{" "}
            for more details.
          </p>
        </AlertDescription>
        <button
          onClick={() => setShowNotice(false)}
          className="absolute top-2 right-2 text-yellow-600 hover:text-yellow-800"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </Alert>
    </div>
  )
}
