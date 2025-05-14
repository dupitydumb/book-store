import { collection, getDocs, limit, query } from "firebase/firestore"
import { db } from "../config"

export interface ConnectionStatus {
  connected: boolean
  error?: string
  details?: string
  timestamp: number
}

// Cache the connection status to avoid too many checks
let cachedStatus: ConnectionStatus | null = null
const CACHE_DURATION = 60000 // 1 minute

export async function checkFirestoreConnection(): Promise<ConnectionStatus> {
  // Return cached status if available and recent
  if (cachedStatus && Date.now() - cachedStatus.timestamp < CACHE_DURATION) {
    return cachedStatus
  }

  try {
    // Try to fetch a small amount of data from Firestore
    const testQuery = query(collection(db, "books"), limit(1))
    await getDocs(testQuery)

    // If we get here, connection was successful
    cachedStatus = {
      connected: true,
      timestamp: Date.now(),
    }
    return cachedStatus
  } catch (error) {
    console.error("Firestore connection check failed:", error)

    // Analyze the error to provide more helpful information
    let errorMessage = "Unknown error"
    let details = ""

    if (error instanceof Error) {
      errorMessage = error.message

      // Check for common error patterns
      if (errorMessage.includes("permission-denied")) {
        details = "Firebase security rules may be preventing access. Check your Firestore rules."
      } else if (errorMessage.includes("not-found")) {
        details = "The Firebase project or collection may not exist."
      } else if (errorMessage.includes("unavailable")) {
        details = "The Firebase service is currently unavailable. This could be a temporary issue."
      } else if (errorMessage.includes("WebChannelConnection")) {
        details =
          "Network connectivity issue or CORS problem. Check your network connection and Firebase configuration."
      }
    }

    cachedStatus = {
      connected: false,
      error: errorMessage,
      details,
      timestamp: Date.now(),
    }
    return cachedStatus
  }
}
