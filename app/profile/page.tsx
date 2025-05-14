"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Loader2, LogOut, User } from "lucide-react"

export default function ProfilePage() {
  const { user, userData, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirectTo=/profile")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh] px-4 md:px-6 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-pink-600" />
          <p className="mt-2 text-gray-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !userData) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          {/* Profile Sidebar */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-4">
                    {userData.photoURL ? (
                      <Image
                        src={userData.photoURL || "/placeholder.svg"}
                        alt={userData.displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-pink-100 text-pink-600">
                        <User className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold">{userData.displayName}</h2>
                  <p className="text-sm text-gray-500 mb-4">{userData.email}</p>
                  <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => logout("/")}>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="orders">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="orders" className="pt-6">
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-4">
                        You haven't placed any orders yet. Start shopping to see your orders here.
                      </p>
                      <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => router.push("/books")}>
                        Browse Books
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="wishlist" className="pt-6">
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-500 mb-4">Add books to your wishlist to save them for later.</p>
                      <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => router.push("/books")}>
                        Browse Books
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                        <Separator className="my-2" />
                        <dl className="space-y-2">
                          <div className="flex justify-between py-1">
                            <dt className="text-gray-500">Name</dt>
                            <dd>{userData.displayName}</dd>
                          </div>
                          <div className="flex justify-between py-1">
                            <dt className="text-gray-500">Email</dt>
                            <dd>{userData.email}</dd>
                          </div>
                          <div className="flex justify-between py-1">
                            <dt className="text-gray-500">Member Since</dt>
                            <dd>
                              {userData.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : "N/A"}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Account Settings</h3>
                        <Separator className="my-2" />
                        <div className="space-y-4 pt-2">
                          <Button variant="outline" className="w-full justify-start">
                            Change Password
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            Email Preferences
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
