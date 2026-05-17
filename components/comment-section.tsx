"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, User, MessageSquare, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

interface Comment {
  id: string
  text: string
  author: string
  authorId: string
  createdAt: string
  likes: number
  dislikes: number
  userLiked?: boolean
  userDisliked?: boolean
}

interface CommentSectionProps {
  articleId: string
  articleTitle: string
}

export function CommentSection({ articleId, articleTitle }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Fetch comments for this article
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch comments from a database
        // For this demo, we'll generate some mock comments
        const mockComments: Comment[] = [
          {
            id: "1",
            text: "This article provides valuable insights. I appreciate the fact-checking details.",
            author: "Sarah Johnson",
            authorId: "user1",
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            likes: 12,
            dislikes: 2,
          },
          {
            id: "2",
            text: "I'm not sure I agree with the fact-checking assessment. There seem to be some missing details.",
            author: "Michael Chen",
            authorId: "user2",
            createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            likes: 5,
            dislikes: 8,
          },
          {
            id: "3",
            text: "Thanks for sharing this information. It helped me understand the situation better.",
            author: "Priya Sharma",
            authorId: "user3",
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            likes: 24,
            dislikes: 0,
          },
        ]

        setComments(mockComments)
      } catch (error) {
        console.error("Error fetching comments:", error)
        toast({
          title: "Error",
          description: "Failed to load comments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (articleId) {
      fetchComments()
    }
  }, [articleId, toast])

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to post a comment.",
        variant: "default",
      })
      return
    }

    setIsCommenting(true)
    try {
      // In a real app, you would save the comment to a database
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        text: newComment,
        author: user.email?.split("@")[0] || "Anonymous",
        authorId: user.id,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        userLiked: false,
        userDisliked: false,
      }

      setComments((prev) => [newCommentObj, ...prev])
      setNewComment("")
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      })
    } catch (error) {
      console.error("Error posting comment:", error)
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCommenting(false)
    }
  }

  const handleLikeComment = (commentId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like comments.",
        variant: "default",
      })
      return
    }

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          // If already liked, unlike it
          if (comment.userLiked) {
            return {
              ...comment,
              likes: comment.likes - 1,
              userLiked: false,
            }
          }
          // If disliked, remove dislike and add like
          else if (comment.userDisliked) {
            return {
              ...comment,
              likes: comment.likes + 1,
              dislikes: comment.dislikes - 1,
              userLiked: true,
              userDisliked: false,
            }
          }
          // Otherwise, add like
          return {
            ...comment,
            likes: comment.likes + 1,
            userLiked: true,
          }
        }
        return comment
      }),
    )
  }

  const handleDislikeComment = (commentId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to dislike comments.",
        variant: "default",
      })
      return
    }

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          // If already disliked, remove dislike
          if (comment.userDisliked) {
            return {
              ...comment,
              dislikes: comment.dislikes - 1,
              userDisliked: false,
            }
          }
          // If liked, remove like and add dislike
          else if (comment.userLiked) {
            return {
              ...comment,
              likes: comment.likes - 1,
              dislikes: comment.dislikes + 1,
              userLiked: false,
              userDisliked: true,
            }
          }
          // Otherwise, add dislike
          return {
            ...comment,
            dislikes: comment.dislikes + 1,
            userDisliked: true,
          }
        }
        return comment
      }),
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) {
      return "just now"
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else if (diffDays < 30) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-[#0077b6]" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt="User" />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder={user ? "Add a comment..." : "Sign in to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user || isCommenting}
            className="min-h-[80px] resize-none border-[#0077b6]/30 focus-visible:ring-[#0077b6]/50"
          />
          <div className="flex justify-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSubmitComment}
                disabled={!user || !newComment.trim() || isCommenting}
                className="bg-[#0077b6] hover:bg-[#005f8d]"
              >
                {isCommenting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0077b6] border-t-transparent" />
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border border-[#0077b6]/10 rounded-lg p-4 hover:border-[#0077b6]/30 transition-all duration-300"
              >
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{comment.author}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</div>
                    </div>
                    <p className="mt-2 text-sm">{comment.text}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1 text-xs ${
                          comment.userLiked ? "text-[#0077b6] font-medium" : "text-muted-foreground"
                        } hover:text-[#0077b6] transition-colors duration-200`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{comment.likes}</span>
                      </button>
                      <button
                        onClick={() => handleDislikeComment(comment.id)}
                        className={`flex items-center gap-1 text-xs ${
                          comment.userDisliked ? "text-red-500 font-medium" : "text-muted-foreground"
                        } hover:text-red-500 transition-colors duration-200`}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                        <span>{comment.dislikes}</span>
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-[#0077b6] transition-colors duration-200">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}

