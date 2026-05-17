"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, UserIcon, MessageSquare, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export function UserProfile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [updating, setUpdating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [bio, setBio] = useState("")
  const [savedArticlesCount, setSavedArticlesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  // Initialize Supabase client only on the client side
  // const [supabase, setSupabase] = useState<any>(null)

  // Initialize Supabase client only on the client side
  // useEffect(() => {
  //   setSupabase(createClientComponentClient())
  // }, [])

  // Initialize database tables
  useEffect(() => {
    if (!supabase) return

    const initDb = async () => {
      try {
        await fetch("/api/db-setup")
      } catch (error) {
        console.error("Error initializing database:", error)
      }
    }

    initDb()
  }, [supabase])

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)

        if (data.user) {
          try {
            // Try to get the profile, but handle errors gracefully
            const { data: profileData, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single()

            if (profileData) {
              setProfile(profileData)
              setDisplayName(profileData.display_name || "")
              setBio(profileData.bio || "")
            } else if (error) {
              // If the table doesn't exist or there's another error, just continue
              console.log("Profile not found or table doesn't exist yet:", error.message)

              // Create a basic profile for the user
              try {
                const { error: insertError } = await supabase.from("profiles").upsert({
                  id: data.user.id,
                  display_name: data.user.email?.split("@")[0] || "User",
                  updated_at: new Date().toISOString(),
                })

                if (!insertError) {
                  console.log("Created basic profile")
                  // Set display name after creating profile
                  setDisplayName(data.user.email?.split("@")[0] || "User")
                }
              } catch (e) {
                console.log("Could not create profile, but continuing:", e)
                // Still set a display name even if profile creation fails
                setDisplayName(data.user.email?.split("@")[0] || "User")
              }
            }

            // Try to get saved articles count, but don't fail if it doesn't work
            try {
              const { count, error: countError } = await supabase
                .from("saved_articles")
                .select("*", { count: "exact", head: true })
                .eq("user_id", data.user.id)

              if (!countError) {
                setSavedArticlesCount(count || 0)
              }
            } catch (e) {
              console.log("Could not get saved articles count:", e)
            }
          } catch (error) {
            console.error("Error fetching profile:", error)
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [toast])

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    if (!user) return

    setUpdating(true)
    try {
      // First, ensure the table exists by calling our setup endpoint
      await fetch("/api/db-setup")

      // Then try to upsert the profile
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: displayName,
        phone_number: phoneNumber,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
      setShowSettings(false)
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    )
  }

  if (!user) {
    return null
  }

  const initials = displayName
    ? displayName.substring(0, 2).toUpperCase()
    : user.email
      ? user.email.substring(0, 2).toUpperCase()
      : "U"

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowSettings(true)}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/chat")}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Aria Factbot</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                type="tel"
              />
              <p className="text-xs text-muted-foreground">
                Your phone number will be used for account recovery and notifications
              </p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email || ""} disabled />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={updateProfile} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

