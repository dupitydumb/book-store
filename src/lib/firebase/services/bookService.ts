import { collection, getDocs, getDoc, doc, query, where, addDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../config"
import { fallbackBooks } from "./fallback-data"
import { checkFirestoreConnection } from "../utils/connection-checker"

export interface Book {
  id: string
  title: string
  author: string
  price: number
  rating: number
  reviewCount: number
  coverImage: string
  category: string
  description: string
  fullDescription?: string
  createdAt?: Date
  updatedAt?: Date
}

// Get all books
export async function getAllBooks(): Promise<Book[]> {
  try {
    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      console.warn("Using fallback books data due to Firebase connection issue")
      return fallbackBooks
    }

    const booksCollection = collection(db, "books")
    const snapshot = await getDocs(booksCollection)

    if (snapshot.empty) {
      console.warn("No books found in Firestore, using fallback data")
      return fallbackBooks
    }

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Book,
    )
  } catch (error) {
    console.error("Error getting all books:", error)
    return fallbackBooks
  }
}

// Get book by ID
export async function getBookById(id: string): Promise<Book | null> {
  try {
    // Check if it's a fallback ID
    if (id.startsWith("fallback-")) {
      const fallbackBook = fallbackBooks.find((book) => book.id === id)
      return fallbackBook || null
    }

    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      console.warn("Using fallback book data due to Firebase connection issue")
      return fallbackBooks[0]
    }

    const docRef = doc(db, "books", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Book
    } else {
      return null
    }
  } catch (error) {
    console.error(`Error getting book with ID ${id}:`, error)
    return fallbackBooks[0]
  }
}

// Get books by category
export async function getBooksByCategory(category: string): Promise<Book[]> {
  try {
    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      console.warn("Using fallback books data due to Firebase connection issue")
      return fallbackBooks.filter((book) => book.category === category)
    }

    const booksCollection = collection(db, "books")
    const q = query(booksCollection, where("category", "==", category))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return fallbackBooks.filter((book) => book.category === category)
    }

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Book,
    )
  } catch (error) {
    console.error(`Error getting books in category ${category}:`, error)
    return fallbackBooks.filter((book) => book.category === category)
  }
}

// Get featured books
export async function getFeaturedBooks(limitCount = 8): Promise<Book[]> {
  try {
    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      console.warn("Using fallback books data due to Firebase connection issue")
      return fallbackBooks.slice(0, limitCount)
    }

    const booksCollection = collection(db, "books")
    // First get all books, then sort and limit client-side
    const snapshot = await getDocs(booksCollection)

    if (snapshot.empty) {
      return fallbackBooks.slice(0, limitCount)
    }

    // Convert to Book objects
    const books = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Book,
    )

    // Sort by rating (highest first) and limit
    return books.sort((a, b) => b.rating - a.rating).slice(0, limitCount)
  } catch (error) {
    console.error("Error getting featured books:", error)
    return fallbackBooks.slice(0, limitCount)
  }
}

// Add a new book
export async function addBook(book: Omit<Book, "id">): Promise<string> {
  try {
    console.log("Adding book to Firestore:", book.title)

    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      const errorMsg = `Cannot add book: Firebase connection unavailable. Error: ${connectionStatus.error || "Unknown connection error"}`
      console.error(errorMsg)
      throw new Error(errorMsg)
    }

    const booksCollection = collection(db, "books")
    const bookWithDates = {
      ...book,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Prepared book data with dates, adding to Firestore...")
    const docRef = await addDoc(booksCollection, bookWithDates)
    console.log(`Book added successfully with ID: ${docRef.id}`)
    return docRef.id
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error adding book"
    console.error(`Error adding book "${book.title}":`, error)
    throw new Error(`Failed to add book "${book.title}": ${errorMsg}`)
  }
}

// Update a book
export async function updateBook(id: string, book: Partial<Book>): Promise<void> {
  try {
    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      throw new Error("Cannot update book: Firebase connection unavailable")
    }

    const docRef = doc(db, "books", id)
    await updateDoc(docRef, {
      ...book,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error(`Error updating book with ID ${id}:`, error)
    throw error
  }
}

// Delete a book
export async function deleteBook(id: string): Promise<void> {
  try {
    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      throw new Error("Cannot delete book: Firebase connection unavailable")
    }

    const docRef = doc(db, "books", id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting book with ID ${id}:`, error)
    throw error
  }
}

// Search books
export async function searchBooks(searchTerm: string): Promise<Book[]> {
  try {
    // Check connection first
    const connectionStatus = await checkFirestoreConnection()
    if (!connectionStatus.connected) {
      console.warn("Using fallback books data due to Firebase connection issue")
      return fallbackBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Note: Firestore doesn't support full-text search natively
    // For a real app, consider using Algolia or similar
    // This is a simple implementation that searches by title
    const booksCollection = collection(db, "books")
    const snapshot = await getDocs(booksCollection)

    // Filter books client-side
    return snapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Book,
      )
      .filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
  } catch (error) {
    console.error(`Error searching for books with term ${searchTerm}:`, error)
    return fallbackBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }
}
