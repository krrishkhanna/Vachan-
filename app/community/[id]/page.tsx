"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  ArrowLeft,
  Bell,
  BellOff,
  Share2,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Flag,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

interface Community {
  id: string
  name: string
  description: string
  members: number
  imageUrl: string
  category: string
  joined: boolean
  notifications: boolean
  createdAt: string
}

interface Post {
  id: string
  content: string
  source: string
  author: {
    name: string
    avatar: string
  }
  timestamp: string
  likes: number
  comments: number
  factStatus: "verified" | "false" | "partially-true" | "unverified"
  saved: boolean
}

export default function CommunityPage() {
  const params = useParams()
  const router = useRouter()
  const communityId = params.id as string

  const [community, setCommunity] = useState<Community>({
    id: communityId,
    name: "Political Fact Checkers",
    description: "Verifying political claims and statements from leaders across India",
    members: 12458,
    imageUrl: "/placeholder.svg?height=200&width=200",
    category: "Politics",
    joined: true,
    notifications: true,
    createdAt: "2022-06-15",
  })

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content: "The Indian government has announced a new policy to reduce carbon emissions by 50% by 2030.",
      source: "Ministry of Environment",
      author: {
        name: "Rahul Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: "2 hours ago",
      likes: 245,
      comments: 32,
      factStatus: "verified",
      saved: false,
    },
    {
      id: "2",
      content: "The opposition party claims that unemployment has reached 15% nationwide.",
      source: "News Report",
      author: {
        name: "Priya Patel",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: "5 hours ago",
      likes: 128,
      comments: 56,
      factStatus: "false",
      saved: true,
    },
    {
      id: "3",
      content: "New education policy will make coding mandatory from 6th standard in all schools.",
      source: "Ministry of Education",
      author: {
        name: "Amit Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: "Yesterday",
      likes: 312,
      comments: 45,
      factStatus: "partially-true",
      saved: false,
    },
    {
      id: "4",
      content: "Government plans to introduce a new cryptocurrency regulation bill in the next parliament session.",
      source: "Financial Times",
      author: {
        name: "Neha Singh",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: "2 days ago",
      likes: 189,
      comments: 27,
      factStatus: "unverified",
      saved: false,
    },
    {
      id: "5",
      content: "India has surpassed China as the world's most populous country according to UN data.",
      source: "United Nations",
      author: {
        name: "Vikram Reddy",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: "3 days ago",
      likes: 421,
      comments: 63,
      factStatus: "verified",
      saved: true,
    },
  ])

  const [newComment, setNewComment] = useState("")
  const [activeTab, setActiveTab] = useState("feed")

  const toggleJoin = () => {
    setCommunity({ ...community, joined: !community.joined })
  }

  const toggleNotifications = () => {
    setCommunity({ ...community, notifications: !community.notifications })
  }

  const toggleSave = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, saved: !post.saved } : post)))
  }

  const likePost = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "false":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "partially-true":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "unverified":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return null
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
    <div className="container mx-auto py-6 max-w-3xl">
      {/* Back button */}
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.push("/communities")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Communities
      </Button>

      {/* Community header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={community.imageUrl || "/placeholder.svg"}
                alt={community.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{community.name}</h1>
              <p className="text-gray-600 mt-1">{community.description}</p>

              <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {community.members.toLocaleString()} members
                </Badge>
                <Badge variant="outline">{community.category}</Badge>
                <Badge variant="outline">Created {new Date(community.createdAt).toLocaleDateString()}</Badge>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <Button variant={community.joined ? "outline" : "default"} onClick={toggleJoin}>
                  {community.joined ? "Leave Community" : "Join Community"}
                </Button>

                <Button variant="outline" onClick={toggleNotifications}>
                  {community.notifications ? (
                    <>
                      <BellOff className="h-4 w-4 mr-2" />
                      Mute
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Unmute
                    </>
                  )}
                </Button>

                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="feed" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-4">
          {/* Post input */}
          {community.joined && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input placeholder="Share a fact or ask a question..." className="mb-2" />
                    <div className="flex justify-end">
                      <Button>Post</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Post header */}
                  <div className="p-4 flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{post.author.name}</p>
                          <p className="text-xs text-gray-500">{post.timestamp}</p>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(post.factStatus)}
                          <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                            <Bookmark
                              className={`h-5 w-5 ${post.saved ? "fill-current text-primary" : ""}`}
                              onClick={() => toggleSave(post.id)}
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Post content */}
                      <div className="mt-2">
                        <p className="text-gray-800">{post.content}</p>
                        <p className="text-sm text-gray-500 mt-1">Source: {post.source}</p>
                      </div>

                      {/* Fact check status */}
                      <div className="mt-3">{getStatusBadge(post.factStatus)}</div>

                      {/* Post actions */}
                      <div className="flex gap-4 mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 text-gray-600"
                          onClick={() => likePost(post.id)}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
                          <MessageSquare className="h-4 w-4" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
                          <Flag className="h-4 w-4" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Comments section */}
                  <div className="bg-gray-50 p-4 border-t">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="h-9"
                        />
                        <Button size="sm" className="h-9">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${i + 1}`} />
                      <AvatarFallback>U{i + 1}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">User Name {i + 1}</p>
                      <p className="text-xs text-gray-500">Joined {Math.floor(Math.random() * 12) + 1} months ago</p>
                    </div>
                    {i === 0 && <Badge className="ml-auto">Admin</Badge>}
                    {i === 1 && (
                      <Badge variant="outline" className="ml-auto">
                        Moderator
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Members
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>About This Community</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-gray-600 mt-1">{community.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Rules</h3>
                  <ol className="list-decimal list-inside text-gray-600 mt-1 space-y-1">
                    <li>Be respectful and civil in all discussions</li>
                    <li>Always provide sources for claims and facts</li>
                    <li>No personal attacks or harassment</li>
                    <li>No spam or self-promotion</li>
                    <li>Respect the community guidelines and moderators</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold">Created</h3>
                  <p className="text-gray-600 mt-1">
                    {new Date(community.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

