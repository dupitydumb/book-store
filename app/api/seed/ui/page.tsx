"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SeedUI() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runSeed = async () => {
    try {
      setStatus("loading")
      setError(null)

      const response = await fetch("/api/seed")
      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setResult(data)
      } else {
        setStatus("error")
        setError(data.message || data.error || "Failed to seed database")
        setResult(data)
      }
    } catch (error) {
      setStatus("error")
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  useEffect(() => {
    runSeed()
  }, [])

  return (
    <div className="container py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Database Seed Operation</CardTitle>
          <CardDescription>Seeding your Firestore database with initial books and categories</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-10 w-10 text-pink-600 animate-spin mb-4" />
              <p className="text-gray-600">Seeding database, please wait...</p>
            </div>
          )}

          {status === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                <p className="mb-2">{result.message}</p>

                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Categories</h3>
                    <p className="text-sm">{result.details?.categories?.message}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Books</h3>
                    <p className="text-sm">{result.details?.books?.message}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                <p className="mb-2">{error}</p>
                {result && (
                  <pre className="mt-2 p-2 bg-red-100/50 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/firebase-status">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Firebase Status
            </Button>
          </Link>

          <Button onClick={runSeed} disabled={status === "loading"} className="bg-pink-600 hover:bg-pink-700">
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Seeding...
              </>
            ) : (
              "Try Again"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
