import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../config"
import { fallbackCategories } from "./fallback-data"
import { checkFirestoreConnection } from "../utils/connection-checker"

export interface Category {
  id: string
  name: string
  slug: string
  count: number
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      console.warn("Using fallback categories data due to Firebase connection issue")
      return fallbackCategories
    }

    const categoriesCollection = collection(db, "categories")
    const snapshot = await getDocs(categoriesCollection)

    if (snapshot.empty) {
      console.warn("No categories found in Firestore, using fallback data")
      return fallbackCategories
    }

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Category,
    )
  } catch (error) {
    console.error("Error getting all categories:", error)
    return fallbackCategories
  }
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    // Check if it's a fallback ID
    if (id.startsWith("fallback-")) {
      const fallbackCategory = fallbackCategories.find((category) => category.id === id)
      return fallbackCategory || null
    }

    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      console.warn("Using fallback category data due to Firebase connection issue")
      return fallbackCategories[0]
    }

    const docRef = doc(db, "categories", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Category
    } else {
      return null
    }
  } catch (error) {
    console.error(`Error getting category with ID ${id}:`, error)
    return fallbackCategories[0]
  }
}

// Add a new category
export async function addCategory(category: Omit<Category, "id">): Promise<string> {
  try {
    console.log("Adding category to Firestore:", category.name)

    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      const errorMsg = `Cannot add category: Firebase connection unavailable. Error: ${connectionStatus.error || "Unknown connection error"}`
      console.error(errorMsg)
      throw new Error(errorMsg)
    }

    const categoriesCollection = collection(db, "categories")

    console.log("Adding category to Firestore collection...")
    const docRef = await addDoc(categoriesCollection, category)
    console.log(`Category added successfully with ID: ${docRef.id}`)
    return docRef.id
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error adding category"
    console.error(`Error adding category "${category.name}":`, error)
    throw new Error(`Failed to add category "${category.name}": ${errorMsg}`)
  }
}

// Update a category
export async function updateCategory(id: string, category: Partial<Category>): Promise<void> {
  try {
    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      throw new Error("Cannot update category: Firebase connection unavailable")
    }

    const docRef = doc(db, "categories", id)
    await updateDoc(docRef, category)
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error)
    throw error
  }
}

// Delete a category
export async function deleteCategory(id: string): Promise<void> {
  try {
    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      throw new Error("Cannot delete category: Firebase connection unavailable")
    }

    const docRef = doc(db, "categories", id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error)
    throw error
  }
}
