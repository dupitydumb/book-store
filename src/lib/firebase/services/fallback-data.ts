// Fallback data to use when Firebase is not available
export const fallbackBooks = [
  {
    id: "fallback-1",
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 12.99,
    rating: 4.5,
    reviewCount: 2547,
    coverImage: "/placeholder.svg?height=600&width=400",
    category: "fiction",
    description: "Between life and death there is a library, and within that library, the shelves go on forever.",
    fullDescription:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
  },
  {
    id: "fallback-2",
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
    id: "fallback-3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 13.99,
    rating: 4.6,
    reviewCount: 3102,
    coverImage: "/placeholder.svg?height=600&width=400",
    category: "science-fiction",
    description: "A lone astronaut must save the earth from disaster.",
    fullDescription:
      "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
  },
]

export const fallbackCategories = [
  { id: "fallback-1", name: "Fiction", count: 1245, slug: "fiction" },
  { id: "fallback-2", name: "Non-Fiction", count: 867, slug: "non-fiction" },
  { id: "fallback-3", name: "Science Fiction", count: 532, slug: "science-fiction" },
  { id: "fallback-4", name: "Self-Help", count: 391, slug: "self-help" },
]
