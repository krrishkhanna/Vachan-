"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, TrendingUp, MessageSquare, ChevronRight, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"

interface Community {
  id: string
  name: string
  description: string
  members: number
  posts: number
  icon: React.ReactNode
  category: string
  joined: boolean
  trending?: boolean
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  imageUrl?: string
}

export function CommunitiesSection() {
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: "politics",
      name: "Politics & Governance",
      description: "Discuss policies, elections, and governance issues with fact-based conversations",
      members: 12453,
      posts: 342,
      icon: <MessageSquare className="h-5 w-5" />,
      category: "politics",
      joined: false,
      trending: true,
      lastMessage: "New fact check on election claims",
      lastMessageTime: "2h ago",
      unreadCount: 3,
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/politics-community-image.jpg",
    },
    {
      id: "innovation",
      name: "Tech & Innovation",
      description: "Explore the latest in technology, startups, and digital transformation",
      members: 8976,
      posts: 215,
      icon: <MessageSquare className="h-5 w-5" />,
      category: "tech",
      joined: true,
      lastMessage: "AI breakthrough in medical research",
      lastMessageTime: "5m ago",
      unreadCount: 1,
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tech-community-image.jpg",
    },
    {
      id: "health",
      name: "Health & Wellness",
      description: "Evidence-based discussions on health, medicine, and wellness practices",
      members: 7654,
      posts: 189,
      icon: <MessageSquare className="h-5 w-5" />,
      category: "health",
      joined: false,
      trending: true,
      lastMessage: "Debunking viral health myths",
      lastMessageTime: "1d ago",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/health-community-image.jpg",
    },
    {
      id: "finance",
      name: "Finance & Economy",
      description: "Analyze economic trends, investments, and financial literacy",
      members: 6543,
      posts: 167,
      icon: <MessageSquare className="h-5 w-5" />,
      category: "finance",
      joined: false,
      lastMessage: "Market analysis for Q1 2025",
      lastMessageTime: "3h ago",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/finance-community-image.jpg",
    },
    {
      id: "global",
      name: "Global Affairs",
      description: "International news, geopolitics, and cross-border issues",
      members: 5432,
      posts: 145,
      icon: <MessageSquare className="h-5 w-5" />,
      category: "global",
      joined: false,
      trending: true,
      lastMessage: "Breaking: UN climate agreement",
      lastMessageTime: "Just now",
      unreadCount: 5,
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/global-community-image.jpg",
    },
    {
      id: "trending",
      name: "Trending Topics",
      description: "Stay updated with the most discussed and fact-checked topics",
      members: 9876,
      posts: 432,
      icon: <MessageSquare className="h-5 w-5" />,
      category: "trending",
      joined: false,
      lastMessage: "Today's top fact-checked stories",
      lastMessageTime: "30m ago",
      unreadCount: 2,
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/trending-community-image.jpg",
    },
  ])

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)

        // If we have a user, update the joined status of communities
        if (data.user) {
          // In a real app, you would fetch the user's joined communities from the database
          setCommunities((prev) =>
            prev.map((community) => ({
              ...community,
              joined: community.id === "innovation" || community.id === "trending",
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [])

  const handleJoinCommunity = (communityId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join communities",
        variant: "default",
      })
      return
    }

    setCommunities((prev) =>
      prev.map((community) => {
        if (community.id === communityId) {
          const newJoinedState = !community.joined

          // Show toast based on join/leave action
          if (newJoinedState) {
            toast({
              title: `Joined ${community.name}`,
              description: "You'll now see posts from this community in your feed.",
            })
          } else {
            toast({
              title: `Left ${community.name}`,
              description: "You'll no longer see posts from this community.",
            })
          }

          return {
            ...community,
            joined: newJoinedState,
            members: newJoinedState ? community.members + 1 : community.members - 1,
          }
        }
        return community
      }),
    )
  }

  const handleCommunityClick = (communityId: string) => {
    router.push(`/community/${communityId}`)
  }

  // Filter communities based on search
  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="border border-[#0077b6]/20 overflow-hidden">
      <CardHeader className="pb-3 bg-[#0077b6]/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-[#0077b6]" />
            Communities
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => router.push("/communities")} className="text-[#0077b6]">
            View All
          </Button>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search communities..."
            className="pl-9 border-[#0077b6]/30 focus-visible:ring-[#0077b6]/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[420px]">
          <div className="divide-y divide-border">
            {filteredCommunities.map((community) => (
              <motion.div
                key={community.id}
                whileHover={{ backgroundColor: "rgba(0, 119, 182, 0.05)" }}
                transition={{ duration: 0.2 }}
                onClick={() => handleCommunityClick(community.id)}
                className="cursor-pointer p-3 flex items-center gap-3"
              >
                <Avatar className="h-12 w-12 rounded-full">
                  {community.imageUrl ? (
                    <AvatarImage src={community.imageUrl} alt={community.name} />
                  ) : (
                    <AvatarFallback className="bg-[#0077b6]/10 text-[#0077b6]">
                      {community.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm flex items-center gap-2 truncate">
                        {community.name}
                        {community.trending && (
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Hot
                          </Badge>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{community.lastMessage}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">{community.lastMessageTime}</span>
                      {community.unreadCount && <Badge className="bg-[#0077b6]">{community.unreadCount}</Badge>}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-[#0077b6] hover:text-[#005f8d] hover:bg-[#0077b6]/10"
            onClick={() => router.push("/communities")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Explore Communities
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#0077b6]/30 hover:border-[#0077b6]/60"
            onClick={() => router.push("/communities")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Create New
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

