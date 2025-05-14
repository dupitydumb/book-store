"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Book } from "@/lib/firebase/services/bookService"
import { addBook } from "@/lib/firebase/services/bookService"
import { getAllCategories } from "@/lib/firebase/services/categoryService"
import type { Category } from "@/lib/firebase/services/categoryService"
import { useFirebase } from "@/lib/firebase/context/FirebaseContext"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function NewBookPage() {
  const [book, setBook] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    price: 0,
    rating: 0,
    reviewCount: 0,
    coverImage: "/placeholder.svg?height=600&width=400",
    category: "",
    description: "",
    fullDescription: "",
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading } = useFirebase()

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getAllCategories()
        setCategories(categoriesData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setLoading(false)
      }
    }

    if (!authLoading && !user) {
      router.push("/login")
    } else if (!authLoading) {
      fetchCategories()
    }
  }, [authLoading, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBook((prev) => ({
      ...prev,
      [name]: name === "price" || name === "rating" || name === "reviewCount" ? Number.parseFloat(value) : value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setBook((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await addBook(book)
      router.push("/admin/books")
      toast.success("Book added successfully!")
    } catch (error) {
      console.error("Error adding book:", error)
      toast.error("Failed to add book.")
      setSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container px-4 md:px-6 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Book</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={book.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" value={book.author} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={book.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={book.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={book.rating}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewCount">Review Count</Label>
                <Input
                  id="reviewCount"
                  name="reviewCount"
                  type="number"
                  min="0"
                  value={book.reviewCount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input id="coverImage" name="coverImage" value={book.coverImage} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                value={book.description}
                onChange={handleChange}
                required
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullDescription">Full Description</Label>
              <Textarea
                id="fullDescription"
                name="fullDescription"
                value={book.fullDescription}
                onChange={handleChange}
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={submitting}>
                {submitting ? "Adding..." : "Add Book"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
