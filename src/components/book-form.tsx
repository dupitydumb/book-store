"use client"

import type React from "react"

import type { Book, Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

interface BookFormProps {
  book: Book
  categories: Category[]
}

export const BookForm = ({ book, categories }: BookFormProps) => {
  const router = useRouter()
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [price, setPrice] = useState(book.price.toString())
  const [categoryId, setCategoryId] = useState(book.categoryId)
  const [coverImage, setCoverImage] = useState(book.coverImage)
  const [description, setDescription] = useState(book.description)

  const { mutate: updateBook, isLoading: isUpdateLoading } = useMutation({
    mutationFn: async (book: Book) => {
      await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        body: JSON.stringify(book),
      })
    },
    onSuccess: () => {
      toast.success("Book updated successfully")
      router.push("/admin/books")
    },
    onError: (error) => {
      toast.error("Failed to update book")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateBook({
      ...book,
      title,
      author,
      price: Number.parseFloat(price),
      categoryId,
      coverImage,
      description,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <Button type="submit" disabled={isUpdateLoading}>
        {isUpdateLoading ? "Updating..." : "Update Book"}
      </Button>
    </form>
  )
}
