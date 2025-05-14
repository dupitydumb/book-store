import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/books" className="text-sm hover:underline">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/books/new-releases" className="text-sm hover:underline">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/books/bestsellers" className="text-sm hover:underline">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/books/coming-soon" className="text-sm hover:underline">
                  Coming Soon
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-sm hover:underline">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help/shipping" className="text-sm hover:underline">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/help/returns" className="text-sm hover:underline">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/help/faq" className="text-sm hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help/accessibility" className="text-sm hover:underline">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-pink-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-pink-600">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-pink-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Subscribe to our newsletter</h4>
              <form className="flex space-x-2">
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Email"
                  type="email"
                />
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white shadow hover:bg-pink-700 h-9 px-4 py-2">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">© 2024 BrightBooks. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-gray-500 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:underline">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-xs text-gray-500 hover:underline">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
