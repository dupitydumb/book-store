import { NextResponse, type NextRequest } from "next/server"
import { seedDatabase } from "@/lib/firebase/seed"
import { checkFirestoreConnection } from "@/lib/firebase/utils/connection-checker"

export async function GET(request: NextRequest) {
  // Check if this is a browser request (not a fetch)
  const acceptHeader = request.headers.get("accept") || ""
  const isHtmlRequest = acceptHeader.includes("text/html")

  // If it's a browser request, redirect to the UI version
  if (isHtmlRequest) {
    return NextResponse.redirect(new URL("/api/seed/ui", request.url))
  }

  try {
    // First check if Firebase is connected
    console.log("Checking Firebase connection before seeding...")
    const connectionStatus = await checkFirestoreConnection()

    if (!connectionStatus.connected) {
      console.error("Cannot seed database: Firebase connection unavailable", connectionStatus)
      return NextResponse.json(
        {
          success: false,
          error: "Firebase connection unavailable",
          details: connectionStatus.error || "Unknown connection error",
          message: "Could not connect to Firebase. Please check your Firebase configuration and try again.",
        },
        { status: 500 },
      )
    }

    console.log("Firebase connection successful, starting database seeding...")
    const result = await seedDatabase()

    console.log("Database seeding completed successfully:", result)
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      details: result,
    })
  } catch (error) {
    // Log the full error for debugging
    console.error("Error seeding database:", error)

    // Prepare a detailed error response
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
        message: "Failed to seed database. See error details.",
      },
      { status: 500 },
    )
  }
}
