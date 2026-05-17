"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Edit, LogOut, CheckCircle, History, Shield, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  joinedDate: string
  factChecksSubmitted: number
  communitiesJoined: number
  trustScore: number
  badges: string[]
}

interface JoinedCommunity {
  id: string
  name: string
  imageUrl: string
  members: number
  category: string
  role: "member" | "moderator" | "admin"
  unreadCount: number
}

interface SavedFact {
  id: string
  title: string
  source: string
  date: string
  status: "verified" | "false" | "partially-true" | "unverified"
}

export default function ProfilePage() {
  const router = useRouter()
  // Only create the Supabase client on the client side
  // Initialize Supabase client only on the client side

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
    bio: "Passionate about truth and facts. Working to combat misinformation in India.",
    joinedDate: "2023-01-15",
    factChecksSubmitted: 47,
    communitiesJoined: 5,
    trustScore: 92,
    badges: ["Fact Checker", "Community Builder", "Trusted Source"],
  })

  const [joinedCommunities, setJoinedCommunities] = useState<JoinedCommunity[]>([
    {
      id: "1",
      name: "Political Fact Checkers",
      imageUrl: "/placeholder.svg?height=80&width=80",
      members: 12458,
      category: "Politics",
      role: "moderator",
      unreadCount: 5,
    },
    {
      id: "2",
      name: "Health Myths Busters",
      imageUrl: "/placeholder.svg?height=80&width=80",
      members: 8932,
      category: "Health",
      role: "member",
      unreadCount: 0,
    },
    {
      id: "5",
      name: "Climate Facts",
      imageUrl: "/placeholder.svg?height=80&width=80",
      members: 7845,
      category: "Environment",
      role: "member",
      unreadCount: 0,
    },
    {
      id: "7",
      name: "Science Fact Checkers",
      imageUrl: "/placeholder.svg?height=80&width=80",
      members: 9876,
      category: "Science",
      role: "admin",
      unreadCount: 0,
    },
    {
      id: "8",
      name: "Media Literacy",
      imageUrl: "/placeholder.svg?height=80&width=80",
      members: 5432,
      category: "Media",
      role: "member",
      unreadCount: 3,
    },
  ])

  const [savedFacts, setSavedFacts] = useState<SavedFact[]>([
    {
      id: "1",
      title: "India's COVID-19 vaccination drive is the world's largest",
      source: "Ministry of Health",
      date: "2023-12-15",
      status: "verified",
    },
    {
      id: "2",
      title: "Opposition party claims that unemployment has reached 15% nationwide",
      source: "News Report",
      date: "2023-12-10",
      status: "false",
    },
    {
      id: "3",
      title: "New education policy will make coding mandatory from 6th standard",
      source: "Ministry of Education",
      date: "2023-12-05",
      status: "partially-true",
    },
    {
      id: "4",
      title: "Government plans to introduce a new cryptocurrency regulation bill",
      source: "Financial Times",
      date: "2023-12-01",
      status: "unverified",
    },
  ])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
      case "moderator":
        return <Badge className="bg-blue-100 text-blue-800">Moderator</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Member</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "false":
        return <Badge className="bg-red-100 text-red-800">False</Badge>
      case "partially-true":
        return <Badge className="bg-amber-100 text-amber-800">Partially True</Badge>
      case "unverified":
        return <Badge className="bg-blue-100 text-blue-800">Unverified</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4">
                  <Image
                    src={userProfile.avatar || "/placeholder.svg"}
                    alt={userProfile.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h1 className="text-xl font-bold">{userProfile.name}</h1>
                <p className="text-gray-500 text-sm">{userProfile.email}</p>

                <div className="mt-4 w-full">
                  <Button className="w-full mb-2">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>

                <div className="mt-6 w-full">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Fact Checks
                    </span>
                    <span className="font-medium">{userProfile.factChecksSubmitted}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Communities
                    </span>
                    <span className="font-medium">{userProfile.communitiesJoined}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Trust Score
                    </span>
                    <span className="font-medium">{userProfile.trustScore}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 flex items-center">
                      <History className="h-4 w-4 mr-2" />
                      Joined
                    </span>
                    <span className="font-medium">{new Date(userProfile.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-6 w-full">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Badges
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.badges.map((badge, index) => (
                      <Badge key={index} variant="outline">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="communities">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="communities">Communities</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Communities tab */}
            <TabsContent value="communities" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Joined Communities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {joinedCommunities.map((community) => (
                      <Link href={`/community/${community.id}`} key={community.id}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border">
                          <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={community.imageUrl || "/placeholder.svg"}
                              alt={community.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium truncate">{community.name}</h3>
                              {getRoleBadge(community.role)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs px-1.5 py-0 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {community.members.toLocaleString()}
                              </Badge>
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                {community.category}
                              </Badge>
                            </div>
                          </div>

                          {community.unreadCount > 0 && (
                            <div className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {community.unreadCount}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => router.push("/communities")}>
                      Discover More Communities
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Saved tab */}
            <TabsContent value="saved" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Saved Facts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {savedFacts.map((fact) => (
                      <div key={fact.id} className="p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{fact.title}</h3>
                          {getStatusBadge(fact.status)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Source: {fact.source}</p>
                          <p>Saved on: {new Date(fact.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings tab */}
            <TabsContent value="settings" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Profile Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-600">Name</label>
                          <input type="text" value={userProfile.name} className="w-full p-2 border rounded-md mt-1" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Email</label>
                          <input
                            type="email"
                            value={userProfile.email}
                            className="w-full p-2 border rounded-md mt-1"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Bio</label>
                          <textarea value={userProfile.bio} className="w-full p-2 border rounded-md mt-1 h-24" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Notification Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Community updates</span>
                          <input type="checkbox" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Fact check alerts</span>
                          <input type="checkbox" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Direct messages</span>
                          <input type="checkbox" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Email notifications</span>
                          <input type="checkbox" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Privacy Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Show my profile to everyone</span>
                          <input type="checkbox" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Allow others to see my fact check history</span>
                          <input type="checkbox" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Show my communities to everyone</span>
                          <input type="checkbox" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

