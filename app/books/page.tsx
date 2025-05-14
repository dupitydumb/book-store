"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Filter, ShoppingCart, Star } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { getAllBooks } from "@/lib/firebase/services/bookService"
import { getAllCategories } from "@/lib/firebase/services/categoryService"
import type { Book } from "@/lib/firebase/services/bookService"
import type { Category } from "@/lib/firebase/services/categoryService"

export default function BooksPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 50])
  const [sortOption, setSortOption] = useState("featured")
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const router = useRouter()
  const { user, authLoading } = useAuth()

  useEffect(() => {
    async function fetchData() {
      try {
        const [booksData, categoriesData] = await Promise.all([getAllBooks(), getAllCategories()])

        console.log(`Fetched ${booksData.length} books from database`)

        setBooks(booksData)
        setCategories(categoriesData)

        // If category is specified in URL, select it
        if (categoryParam) {
          setSelectedCategories([categoryParam])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    if (!authLoading && !user) {
      router.push("/login")
    } else if (!authLoading) {
      fetchData()
    }
  }, [authLoading, user, router, categoryParam])

  // Filter books based on selected filters
  const filteredBooks = books.filter((book) => {
    // Filter by category
    if (selectedCategories.length > 0 && !selectedCategories.includes(book.category)) {
      return false
    }

    // Filter by price
    if (book.price < priceRange[0] || book.price > priceRange[1]) {
      return false
    }

    return true
  })

  // Sort books based on selected sort option
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Books</h1>
          <p className="text-gray-500">Browse our collection of {books.length} books</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort by: {getSortLabel(sortOption)}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOption("featured")}>Featured</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("price-low")}>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("price-high")}>Price: High to Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("rating")}>Highest Rated</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? "block" : "hidden"} md:block space-y-6`}>
          <div className="flex items-center justify-between md:hidden">
            <h2 className="font-semibold">Filters</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              Close
            </Button>
          </div>

          <Accordion type="multiple" defaultValue={["categories", "price"]}>
            <AccordionItem value="categories">
              <AccordionTrigger>Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={() => toggleCategory(category.slug)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
              <AccordionTrigger>Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Slider defaultValue={[0, 50]} max={50} step={1} value={priceRange} onValueChange={setPriceRange} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">$</span>
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                        className="h-8 w-16"
                      />
                    </div>
                    <span className="text-sm">to</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">$</span>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                        className="h-8 w-16"
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rating">
              <AccordionTrigger>Rating</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox id={`rating-${rating}`} />
                      <Label
                        htmlFor={`rating-${rating}`}
                        className="text-sm font-normal cursor-pointer flex items-center"
                      >
                        {Array(rating)
                          .fill(null)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        {Array(5 - rating)
                          .fill(null)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          ))}
                        <span className="ml-1">& Up</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setSelectedCategories([])
                setPriceRange([0, 50])
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Book Grid */}
        <div className="md:col-span-3">
          {sortedBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <h3 className="text-xl font-semibold">No books found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBooks.map((book) => (
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
          )}
        </div>
      </div>
    </div>
  )
}

function getSortLabel(sortOption: string) {
  switch (sortOption) {
    case "price-low":
      return "Price: Low to High"
    case "price-high":
      return "Price: High to Low"
    case "rating":
      return "Highest Rated"
    default:
      return "Featured"
  }
}
