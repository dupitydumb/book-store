import Link from "next/link"
import Image from "next/image"
import { BookOpen, ChevronRight, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getFeaturedBooks } from "@/lib/firebase/services/bookService"
import { getAllCategories } from "@/lib/firebase/services/categoryService"

export default async function Home() {
  // Fetch data with error handling
  let featuredBooks = []
  let categories = []

  try {
    // Use Promise.allSettled to handle potential errors in either request
    const [booksResult, categoriesResult] = await Promise.allSettled([getFeaturedBooks(8), getAllCategories()])

    // Extract data if promises were fulfilled
    if (booksResult.status === "fulfilled") {
      featuredBooks = booksResult.value
    }

    if (categoriesResult.status === "fulfilled") {
      categories = categoriesResult.value
    }
  } catch (error) {
    console.error("Error fetching data for homepage:", error)
    // Continue with empty arrays if there's an error
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-yellow-300 via-orange-200 to-pink-200">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                New Releases Every Week
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Discover Your Next Favorite Book
              </h1>
              <p className="max-w-[600px] text-gray-700 md:text-xl">
                Browse our extensive collection of books across all genres. From bestsellers to hidden gems, we have
                something for everyone.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/books">
                  <Button className="bg-pink-600 hover:bg-pink-700">Browse Books</Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-100">
                    Explore Categories
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Book collection"
                width={600}
                height={400}
                className="rounded-lg object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="w-full py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Books</h2>
              <p className="text-gray-500">Handpicked recommendations just for you</p>
            </div>
            <Link href="/books" className="flex items-center text-pink-600 hover:underline">
              View all books <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {featuredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredBooks.map((book) => (
                <Link key={book.id} href={`/books/${book.id}`} className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
                      <Image
                        src={book.coverImage || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-sm font-medium">{book.rating}</span>
                        </div>
                        <div className="text-sm text-gray-500">({book.reviewCount} reviews)</div>
                      </div>
                      <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-pink-600">${book.price.toFixed(2)}</span>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ShoppingCart className="h-4 w-4" />
                          <span className="sr-only">Add to cart</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No featured books available. Visit the{" "}
                <Link href="/firebase-status" className="text-pink-600 hover:underline">
                  Firebase Status
                </Link>{" "}
                page to check your connection or{" "}
                <Link href="/api/seed" className="text-pink-600 hover:underline">
                  seed your database
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="w-full py-12 bg-orange-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Browse by Category</h2>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/books?category=${category.slug}`}
                  className="group flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 mb-3">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-center font-medium group-hover:text-pink-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-center text-gray-500">{category.count} Books</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No categories available. Visit the{" "}
                <Link href="/firebase-status" className="text-pink-600 hover:underline">
                  Firebase Status
                </Link>{" "}
                page to check your connection or{" "}
                <Link href="/api/seed" className="text-pink-600 hover:underline">
                  seed your database
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-pink-500 to-orange-500 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Join Our Book Club</h2>
            <p className="max-w-[600px] text-pink-100">
              Subscribe to our newsletter and get updates on new releases, exclusive discounts, and reading
              recommendations.
            </p>
            <div className="flex w-full max-w-md flex-col gap-2 min-[400px]:flex-row">
              <input
                className="flex h-10 w-full rounded-md border border-pink-400 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black"
                placeholder="Enter your email"
                type="email"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
