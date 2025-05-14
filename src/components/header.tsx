"use client"

import Link from "next/link"
import { Search, ShoppingBag, User, LogIn, Menu } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"

export default function Header() {
  const { user, userData, loading, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden mr-2">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mb-4">
                <SheetTitle>BrightBooks</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4">
                <SheetClose asChild>
                  <Link href="/" className="text-lg font-medium hover:text-pink-600 transition-colors">
                    Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/books" className="text-lg font-medium hover:text-pink-600 transition-colors">
                    Books
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/categories" className="text-lg font-medium hover:text-pink-600 transition-colors">
                    Categories
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/about" className="text-lg font-medium hover:text-pink-600 transition-colors">
                    About
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/contact" className="text-lg font-medium hover:text-pink-600 transition-colors">
                    Contact
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/firebase-status" className="text-lg font-medium hover:text-pink-600 transition-colors">
                    Firebase Status
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-pink-600">BrightBooks</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:text-pink-600 transition-colors">
            Home
          </Link>
          <Link href="/books" className="text-sm font-medium hover:text-pink-600 transition-colors">
            Books
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-pink-600 transition-colors">
            Categories
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-pink-600 transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-pink-600 transition-colors">
            Contact
          </Link>
          <Link href="/firebase-status" className="text-sm font-medium hover:text-pink-600 transition-colors">
            Firebase Status
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <form className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search books..."
              className="w-[200px] lg:w-[300px] pl-8 bg-gray-50 focus-visible:ring-pink-600"
            />
          </form>

          <Button variant="ghost" size="icon" aria-label="Shopping cart">
            <ShoppingBag className="h-5 w-5" />
          </Button>

          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="bg-white">
                    <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                      {userData?.photoURL ? (
                        <Image
                          src={userData.photoURL || "/placeholder.svg"}
                          alt={userData.displayName}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{userData?.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer">
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="cursor-pointer">
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={() => logout("/")}
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login">
                  <Button className="bg-pink-600 hover:bg-pink-700 hidden md:flex">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
