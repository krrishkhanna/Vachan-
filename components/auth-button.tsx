"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export function AuthButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Handle login
  const handleLogin = () => {
    router.push("/auth")
  }

  // Handle logout
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle profile navigation
  const handleProfile = () => {
    router.push("/profile")
  }

  // If still loading, show a simple button
  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <span className="animate-pulse">Loading...</span>
      </Button>
    )
  }

  // If user is logged in, show profile and logout buttons
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleProfile} className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">Profile</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    )
  }

  // If user is not logged in, show login button
  return (
    <Button variant="default" size="sm" onClick={handleLogin} disabled={isLoading} className="flex items-center gap-2">
      <LogIn className="h-4 w-4" />
      <span>Login</span>
    </Button>
  )
}

