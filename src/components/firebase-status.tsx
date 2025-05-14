"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database } from "lucide-react"
import { checkFirestoreConnection } from "@/lib/firebase/utils/connection-checker"
import { useFirebase } from "@/lib/firebase/context/FirebaseContext"
import Link from "next/link"

export default function FirebaseStatus() {
  const { persistenceEnabled } = useFirebase()
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [bookCount, setBookCount] = useState<number | null>(null)
  const [categoryCount, setCategoryCount] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkConnection = async () => {
    setIsRefreshing(true)
    try {
      // First check the connection
      const connectionStatus = await checkFirestoreConnection()

      if (!connectionStatus.connected) {
        setStatus("error")
        setErrorMessage(connectionStatus.error || "Connection failed")
        setErrorDetails(connectionStatus.details || null)
        setIsRefreshing(false)
        return
      }

      // If connected, try to get collection counts
      const booksCollection = collection(db, "books")
      const categoriesCollection = collection(db, "categories")

      const [booksSnapshot, categoriesSnapshot] = await Promise.all([
        getDocs(booksCollection),
        getDocs(categoriesCollection),
      ])

      setBookCount(booksSnapshot.size)
      setCategoryCount(categoriesSnapshot.size)
      setStatus("connected")
    } catch (error) {
      console.error("Firebase status check error:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Firebase Status
          {status === "connected" ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle className="h-4 w-4 mr-1" /> Connected
            </Badge>
          ) : status === "error" ? (
            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
              <XCircle className="h-4 w-4 mr-1" /> Error
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} /> Checking...
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Status of your Firebase connection and database</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "connected" && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Successfully connected to Firebase project:{" "}
              <span className="font-medium">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</span>
            </p>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant={persistenceEnabled ? "outline" : "secondary"} className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                {persistenceEnabled ? "Persistence Enabled" : "Persistence Disabled"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-pink-800">Books</p>
                <p className="text-2xl font-bold text-pink-600">{bookCount}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-orange-800">Categories</p>
                <p className="text-2xl font-bold text-orange-600">{categoryCount}</p>
              </div>
            </div>
            {(bookCount === 0 || categoryCount === 0) && (
              <Alert variant="default" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Empty Database</AlertTitle>
                <AlertDescription>
                  Your database appears to be empty. Visit{" "}
                  <Link href="/api/seed/ui" className="text-pink-600 hover:underline font-medium">
                    the seed page
                  </Link>{" "}
                  to populate your database with sample data.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              <p>Failed to connect to Firebase. Please check your environment variables and Firebase configuration.</p>
              {errorMessage && (
                <div className="mt-2 p-2 bg-red-100/50 rounded text-xs">
                  <strong>Error:</strong> {errorMessage}
                </div>
              )}
              {errorDetails && (
                <div className="mt-2 p-2 bg-red-100/50 rounded text-xs">
                  <strong>Details:</strong> {errorDetails}
                </div>
              )}
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Troubleshooting steps:</p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Verify your Firebase project exists and is properly set up</li>
                  <li>Check that all environment variables are correctly configured</li>
                  <li>Ensure your Firebase security rules allow read access</li>
                  <li>Check your network connection</li>
                  <li>Try refreshing the page or clearing your browser cache</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {status === "loading" && (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={checkConnection}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Checking..." : "Refresh Status"}
        </Button>
      </CardFooter>
    </Card>
  )
}
