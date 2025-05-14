import type { Metadata } from "next"
import FirebaseStatus from "@/components/firebase-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Firebase Status - Bright Books",
  description: "Check the status of your Firebase connection",
}

export default function FirebaseStatusPage() {
  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Connection Status</h1>
        <FirebaseStatus />

        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Firebase Connection Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Common Issues and Solutions</h3>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <div className="font-medium min-w-[180px]">WebChannel Error:</div>
                    <div className="text-gray-700">
                      This often indicates a network connectivity issue or CORS problem. Check your network connection
                      and ensure your Firebase project is properly configured.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-medium min-w-[180px]">Permission Denied:</div>
                    <div className="text-gray-700">
                      Your Firebase security rules may be preventing access. Make sure your rules allow read access to
                      your collections.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-medium min-w-[180px]">Project Not Found:</div>
                    <div className="text-gray-700">
                      Verify that your Firebase project exists and that your project ID in the environment variables is
                      correct.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-medium min-w-[180px]">Invalid API Key:</div>
                    <div className="text-gray-700">
                      Check that your Firebase API key is correct in your environment variables.
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Environment Variables</h3>
                <p className="text-gray-700 mb-2">
                  Ensure all required Firebase environment variables are set correctly:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
                  <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
                  <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
                  <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
                  <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
                  <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Firebase Console</h3>
                <p className="text-gray-700">
                  Check your Firebase project in the Firebase Console to ensure it's properly set up and that Firestore
                  is enabled.
                </p>
                <div className="mt-2">
                  <Link
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-pink-600 hover:underline"
                  >
                    Open Firebase Console <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="pt-4 flex gap-4">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
            <Link href="/api/seed">
              <Button className="bg-pink-600 hover:bg-pink-700">Seed Database</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
