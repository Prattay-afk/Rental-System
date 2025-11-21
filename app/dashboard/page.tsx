"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Home, Heart, Calendar, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#cf7636]" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your rentals today
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Listings
                </CardTitle>
                <Home className="h-4 w-4 text-[#cf7636]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-gray-500">
                  Active property listings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Favorites
                </CardTitle>
                <Heart className="h-4 w-4 text-[#cf7636]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-gray-500">
                  Saved properties
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Bookings
                </CardTitle>
                <Calendar className="h-4 w-4 text-[#cf7636]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-gray-500">
                  Upcoming bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Messages
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-[#cf7636]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-gray-500">
                  Unread messages
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest interactions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity yet</p>
                  <p className="text-sm mt-2">
                    Start exploring properties to see your activity here
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium">Browse Properties</div>
                    <div className="text-sm text-gray-500">
                      Explore available rentals
                    </div>
                  </button>
                  <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium">List Your Property</div>
                    <div className="text-sm text-gray-500">
                      Start earning with your space
                    </div>
                  </button>
                  <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium">Edit Profile</div>
                    <div className="text-sm text-gray-500">
                      Update your account information
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

