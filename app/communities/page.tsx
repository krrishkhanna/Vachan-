"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Users, CheckCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Community {
  id: string
  name: string
  description: string
  members: number
  imageUrl: string
  lastActivity: string
  unreadCount: number
  joined: boolean
  category: string
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: "1",
      name: "Political Fact Checkers",
      description: "Verifying political claims and statements from leaders across India",
      members: 12458,
      imageUrl: "/placeholder.svg?height=80&width=80",
      lastActivity: "2 min ago",
      unreadCount: 5,
      joined: true,
      category: "Politics",
    },
    {
      id: "2",
      name: "Health Myths Busters",
      description: "Debunking health misinformation and promoting scientific facts",
      members: 8932,
      imageUrl: "/placeholder.svg?height=80&width=80",
      lastActivity: "15 min ago",
      unreadCount: 0,
      joined: true,
      category: "Health",
    },
    {
      id: "3",
      name: "Tech Truth",
      description: "Separating tech facts from fiction in the digital age",
      members: 6547,
      imageUrl: "/placeholder.svg?height=80&width=80",
      lastActivity: "1 hour ago",
      unreadCount: 12,
      joined: false,
      category: "Technology",
    },
    {
      id: "4",
      name: "Financial Fact Check",
      description: "Verifying financial news, market claims, and investment advice",
      members: 5321,
      imageUrl: "/placeholder.svg?height=80&width=80",
      lastActivity: "3 hours ago",
      unreadCount: 0,
      joined: false,
      category: "Finance",
    },
    {
      id: "5",
      name: "Climate Facts",
      description: "Fact-checking climate change information and environmental news",
      members: 7845,
      imageUrl: "/placeholder.svg?height=80&width=80",
      lastActivity: "Yesterday",
      unreadCount: 0,
      joined: true,
      category: "Environment",
    },
    {
      id: "6",
      name: "Education Verifiers",
      description: "Verifying educational content and academic information",
      members: 4532,
      imageUrl: "/placeholder.svg?height=80&width=80",
      lastActivity: "2 days ago",
      unreadCount: 0,
      joined: false,
      category: "Education",
    },
    {
      id: "7",
      name: "Science Fact Checkers",
      description: "Promoting scientific accuracy and debunking pseudoscience",
      members: 9876,
      imageUrl: "/placeholder.svg?height=80&width=80",
      lastActivity: "3 days ago",
      unreadCount: 0,
      joined: true,
      category: "Science",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all") // 'all', 'joined', 'discover'

  const filteredCommunities = communities
    .filter(
      (community) =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((community) => {
      if (filter === "joined") return community.joined
      if (filter === "discover") return !community.joined
      return true
    })

  const toggleJoin = (id: string) => {
    setCommunities(
      communities.map((community) =>
        community.id === id ? { ...community, joined: !community.joined, unreadCount: 0 } : community,
      ),
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">Communities</h1>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </Button>
        </div>

        {/* Search and filters */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search communities..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 mt-3">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button
              variant={filter === "joined" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("joined")}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Joined
            </Button>
            <Button
              variant={filter === "discover" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("discover")}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Discover
            </Button>
          </div>
        </div>

        {/* Communities list (WhatsApp style) */}
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="divide-y">
            {filteredCommunities.map((community) => (
              <Link href={`/community/${community.id}`} key={community.id}>
                <div className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 relative">
                  {/* Community image */}
                  <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={community.imageUrl || "/placeholder.svg"}
                      alt={community.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Community info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{community.name}</h3>
                      <span className="text-xs text-gray-500">{community.lastActivity}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{community.description}</p>
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

                  {/* Join/Leave button */}
                  <Button
                    variant={community.joined ? "outline" : "default"}
                    size="sm"
                    className="ml-2"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleJoin(community.id)
                    }}
                  >
                    {community.joined ? "Leave" : "Join"}
                  </Button>

                  {/* Unread indicator */}
                  {community.unreadCount > 0 && (
                    <div className="absolute top-4 right-4 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {community.unreadCount}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

