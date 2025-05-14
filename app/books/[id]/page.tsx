import Image from "next/image"
import Link from "next/link"
import { BookOpen, ChevronRight, Heart, ShoppingCart, Star } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getBookById } from "@/lib/firebase/services/bookService"
import { getAllCategories } from "@/lib/firebase/services/categoryService"

interface BookPageProps {
  params: {
    id: string
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const [book, categories] = await Promise.all([getBookById(params.id), getAllCategories()])

  if (!book) {
    notFound()
  }

  // Get related books (in a real app, you'd have a more sophisticated recommendation system)
  // For now, we'll just use some static data
  const relatedBooks = [
    {
      id: "5",
      title: "The Silent Patient",
      author: "Alex Michaelides",
      price: 10.99,
      coverImage: "/placeholder.svg?height=300&width=200",
    },
    {
      id: "6",
      title: "Educated",
      author: "Tara Westover",
      price: 12.49,
      coverImage: "/placeholder.svg?height=300&width=200",
    },
    {
      id: "7",
      title: "The House in the Cerulean Sea",
      author: "TJ Klune",
      price: 11.49,
      coverImage: "/placeholder.svg?height=300&width=200",
    },
    {
      id: "8",
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      price: 15.99,
      coverImage: "/placeholder.svg?height=300&width=200",
    },
    {
      id: "9",
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      price: 11.99,
      coverImage: "/placeholder.svg?height=300&width=200",
    },
  ]

  // Sample reviews (in a real app, these would come from the database)
  const reviews = [
    {
      id: "1",
      name: "Sarah Johnson",
      date: "May 15, 2023",
      rating: 5,
      comment:
        "This book completely changed my perspective. The author's writing style is engaging and the story is captivating from start to finish. I couldn't put it down!",
    },
    {
      id: "2",
      name: "Michael Chen",
      date: "April 3, 2023",
      rating: 4,
      comment:
        "A thought-provoking read with well-developed characters. The plot was a bit slow in the middle, but the ending made up for it. Would definitely recommend.",
    },
    {
      id: "3",
      name: "Jessica Williams",
      date: "March 22, 2023",
      rating: 5,
      comment:
        "One of the best books I've read this year. The author has a unique way of storytelling that keeps you engaged throughout. The themes explored are relevant and meaningful.",
    },
  ]

  return (
    <div className="container px-4 md:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-600">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/books" className="hover:text-pink-600">
          Books
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href={`/books?category=${book.category}`} className="hover:text-pink-600">
          {getCategoryName(book.category, categories)}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900 font-medium">{book.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Book Image */}
        <div className="flex justify-center">
          <div className="relative aspect-[2/3] w-full max-w-md overflow-hidden rounded-lg bg-gray-100 shadow-lg">
            <Image
              src={book.coverImage || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Book Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <Badge className="mb-2 bg-pink-100 text-pink-800 hover:bg-pink-100">
              {getCategoryName(book.category, categories)}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{book.title}</h1>
            <p className="text-lg text-gray-500">by {book.author}</p>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(book.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : i < book.rating
                          ? "fill-yellow-400 text-yellow-400 fill-half"
                          : "text-gray-300"
                    }`}
                  />
                ))}
              <span className="ml-2 text-sm font-medium">{book.rating}</span>
            </div>
            <div className="text-sm text-gray-500">({book.reviewCount} reviews)</div>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-pink-600">${book.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Free shipping on orders over $35</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-500" />
              <span className="text-sm">Paperback, 336 pages</span>
            </div>
            <p className="text-gray-700">{book.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button className="bg-pink-600 hover:bg-pink-700 flex-1">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
              <Heart className="h-5 w-5 mr-2" />
              Add to Wishlist
            </Button>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <p className="text-gray-700">{book.fullDescription || book.description}</p>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Publisher:</span>
                    <span className="text-gray-600">Penguin Books</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Publication Date:</span>
                    <span className="text-gray-600">June 29, 2021</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Language:</span>
                    <span className="text-gray-600">English</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Pages:</span>
                    <span className="text-gray-600">336</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">ISBN-13:</span>
                    <span className="text-gray-600">978-0123456789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Dimensions:</span>
                    <span className="text-gray-600">5.5 x 0.8 x 8.2 inches</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="font-medium">{review.name}</div>
                        <span className="mx-2">•</span>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                      <div className="flex">
                        {Array(5)
                          .fill(null)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Books */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {relatedBooks.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="group">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={book.coverImage || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-medium line-clamp-1 group-hover:text-pink-600">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
                <p className="font-bold text-pink-600 mt-1">${book.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function getCategoryName(slug: string, categories: any[]) {
  const category = categories.find((c) => c.slug === slug)
  return category ? category.name : "Unknown"
}
