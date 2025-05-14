"use client"

import { BookForm } from "@/components/book-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Book, Category } from "@prisma/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface Params {
  params: {
    id: string
  }
}

async function getBook(id: string): Promise<Book> {
  const res = await fetch(`/api/books/${id}`)

  return res.json()
}

async function getCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories")
  return res.json()
}

export default function EditBookPage({ params }: Params) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { id } = params
  // const { toast } = useToast()

  const { data: book, isLoading: isBookLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBook(id),
  })

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const { mutate: deleteBook, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/books/${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      toast.success("Book deleted successfully")
      router.push("/admin/books")
    },
    onError: (error) => {
      toast.error("Failed to delete book")
    },
  })

  if (isBookLoading || isCategoriesLoading) {
    return <div>Loading...</div>
  }

  if (!book || !categories) {
    return <div>Error loading data.</div>
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Book</CardTitle>
          <CardDescription>Edit the book details in this form. Click save when you're done.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <BookForm book={book} categories={categories} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the book from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBook(book.id)} disabled={isDeleteLoading}>
                  {isDeleteLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
