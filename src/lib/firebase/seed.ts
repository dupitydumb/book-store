import { addBook } from "./services/bookService"
import { addCategory } from "./services/categoryService"
import { db } from "./config"
import { collection, getDocs } from "firebase/firestore"

// Helper function to check if a collection exists and has documents
async function collectionExists(collectionName: string): Promise<boolean> {
  try {
    const collectionRef = collection(db, collectionName)
    const snapshot = await getDocs(collectionRef)
    return !snapshot.empty
  } catch (error) {
    console.error(`Error checking if collection ${collectionName} exists:`, error)
    return false
  }
}

export async function seedBooks() {
  try {
    console.log("Starting to seed books...")

    // Check if books already exist
    const booksExist = await collectionExists("books")
    if (booksExist) {
      console.log("Books collection already exists and has documents, skipping seed")
      return { booksAdded: 0, message: "Books already exist, skipping seed" }
    }

    const books = [
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        price: 12.99,
        rating: 4.5,
        reviewCount: 2547,
        coverImage: "/placeholder.svg?height=600&width=400",
        category: "fiction",
        description: "Between life and death there is a library, and within that library, the shelves go on forever.",
        fullDescription:
          "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets? A dazzling novel about all the choices that go into a life well lived, from the internationally bestselling author of Reasons to Stay Alive and How To Stop Time.",
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        price: 14.99,
        rating: 4.8,
        reviewCount: 4215,
        coverImage: "/placeholder.svg?height=600&width=400",
        category: "self-help",
        description: "Tiny Changes, Remarkable Results",
        fullDescription:
          "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
      },
      {
        title: "The Song of Achilles",
        author: "Madeline Miller",
        price: 11.99,
        rating: 4.7,
        reviewCount: 1823,
        coverImage: "/placeholder.svg?height=600&width=400",
        category: "fiction",
        description: "A tale of gods, kings, immortal fame, and the human heart.",
        fullDescription:
          "Greece in the age of heroes. Patroclus, an awkward young prince, has been exiled to the court of King Peleus and his perfect son Achilles. By all rights their paths should never cross, but Achilles takes the shamed prince as his friend, and as they grow into young men skilled in the arts of war and medicine their bond blossoms into something deeper - despite the displeasure of Achilles' mother Thetis, a cruel sea goddess. But then word comes that Helen of Sparta has been kidnapped. Torn between love and fear for his friend, Patroclus journeys with Achilles to Troy, little knowing that the years that follow will test everything they hold dear.",
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        price: 13.99,
        rating: 4.6,
        reviewCount: 3102,
        coverImage: "/placeholder.svg?height=600&width=400",
        category: "science-fiction",
        description: "A lone astronaut must save the earth from disaster.",
        fullDescription:
          "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it. All he knows is that he's been asleep for a very, very long time. And he's just been awakened to find himself millions of miles from home, with nothing but two corpses for company.",
      },
      {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        price: 10.99,
        rating: 4.3,
        reviewCount: 1876,
        coverImage: "/placeholder.svg?height=300&width=200",
        category: "thriller",
        description: "A shocking psychological thriller of a woman's act of violence against her husband.",
        fullDescription:
          "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
      },
    ]

    console.log(`Preparing to add ${books.length} books to Firestore...`)

    // Add books one by one with error handling for each
    const results = []
    for (const book of books) {
      try {
        console.log(`Adding book: ${book.title}`)
        const id = await addBook(book)
        results.push({ title: book.title, id, success: true })
        console.log(`Successfully added book: ${book.title} with ID: ${id}`)
      } catch (error) {
        console.error(`Error adding book ${book.title}:`, error)
        results.push({
          title: book.title,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    console.log(`Added ${successCount} out of ${books.length} books successfully`)

    return {
      booksAdded: successCount,
      message: `Books seeded successfully! (${successCount}/${books.length})`,
      details: results,
    }
  } catch (error) {
    console.error("Error in seedBooks function:", error)
    throw error // Re-throw to be handled by the caller
  }
}

export async function seedCategories() {
  try {
    console.log("Starting to seed categories...")

    // Check if categories already exist
    const categoriesExist = await collectionExists("categories")
    if (categoriesExist) {
      console.log("Categories collection already exists and has documents, skipping seed")
      return { categoriesAdded: 0, message: "Categories already exist, skipping seed" }
    }

    const categories = [
      { name: "Fiction", count: 1245, slug: "fiction" },
      { name: "Non-Fiction", count: 867, slug: "non-fiction" },
      { name: "Science Fiction", count: 532, slug: "science-fiction" },
      { name: "Fantasy", count: 621, slug: "fantasy" },
      { name: "Mystery", count: 438, slug: "mystery" },
      { name: "Biography", count: 312, slug: "biography" },
      { name: "History", count: 284, slug: "history" },
      { name: "Self-Help", count: 391, slug: "self-help" },
      { name: "Romance", count: 512, slug: "romance" },
      { name: "Thriller", count: 367, slug: "thriller" },
    ]

    console.log(`Preparing to add ${categories.length} categories to Firestore...`)

    // Add categories one by one with error handling for each
    const results = []
    for (const category of categories) {
      try {
        console.log(`Adding category: ${category.name}`)
        const id = await addCategory(category)
        results.push({ name: category.name, id, success: true })
        console.log(`Successfully added category: ${category.name} with ID: ${id}`)
      } catch (error) {
        console.error(`Error adding category ${category.name}:`, error)
        results.push({
          name: category.name,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    console.log(`Added ${successCount} out of ${categories.length} categories successfully`)

    return {
      categoriesAdded: successCount,
      message: `Categories seeded successfully! (${successCount}/${categories.length})`,
      details: results,
    }
  } catch (error) {
    console.error("Error in seedCategories function:", error)
    throw error // Re-throw to be handled by the caller
  }
}

export async function seedDatabase() {
  try {
    console.log("Starting database seeding process...")

    // Seed categories first, then books
    const categoriesResult = await seedCategories()
    console.log("Categories seeding completed:", categoriesResult)

    const booksResult = await seedBooks()
    console.log("Books seeding completed:", booksResult)

    return {
      categories: categoriesResult,
      books: booksResult,
      message: "Database seed operation completed",
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error in seedDatabase function:", error)
    throw error // Re-throw to be handled by the caller
  }
}
