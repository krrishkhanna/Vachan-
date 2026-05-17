"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { ShareDialog } from "@/components/share-dialog"
import { TranslationDialog } from "@/components/translation-dialog"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Share2,
  Globe,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FactCheckResult } from "@/components/fact-check-result"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { CommentSection } from "@/components/comment-section"

interface NewsArticle {
  title: string
  content: string
  source: string
  sourceUrl?: string
  hashtags?: string[]
  engagementStats?: {
    tweets: number
    botPercentage?: number
  }
  factCheck?: {
    status: "true" | "false" | "misleading" | "unverified" | "unverifiable"
    details: string
    sources: string[]
  }
  url?: string
  urlToImage?: string
  publishedAt?: string
  author?: string
}

export function NewsCard({ article, isApiArticle = false }: { article: NewsArticle; isApiArticle?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [showTranslateDialog, setShowTranslateDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const { toast } = useToast()

  // Add fact-checking functionality to the NewsCard component
  // Add this function inside the NewsCard component
  const [isFactChecking, setIsFactChecking] = useState(false)
  const [aiFactCheck, setAiFactCheck] = useState<any>(null)

  const performAIFactCheck = async () => {
    setIsFactChecking(true)

    try {
      const response = await fetch("/api/fact-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: article.content,
          title: article.title,
          source: article.source,
          sourceUrl: article.sourceUrl || article.url || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Fact-checking API request failed")
      }

      const result = await response.json()
      setAiFactCheck(result)

      // Update the factCheck status based on AI analysis
      if (isApiArticle && result.classification) {
        // Only update for API articles that don't have fact-check status
        factCheck.status = result.classification
        factCheck.details = result.explanation
        factCheck.sources = result.sources?.map((citation: { title: string }) => citation.title) || factCheck.sources
      }
    } catch (error) {
      console.error("Error during AI fact-checking:", error)
      toast({
        title: "Fact-checking failed",
        description: "Could not perform AI fact-checking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsFactChecking(false)
    }
  }

  // For API articles, create a default factCheck object
  const factCheck = article.factCheck || {
    status: "unverified",
    details: "This article has been sourced from a news API and has not been fact-checked by our system yet.",
    sources: [article.source],
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "true":
        return <Check className="h-5 w-5 text-green-500" />
      case "false":
        return <X className="h-5 w-5 text-red-500" />
      case "misleading":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "true":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800"
      case "false":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800"
      case "misleading":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "true":
        return "Verified True"
      case "false":
        return "False Information"
      case "misleading":
        return "Misleading"
      default:
        return "Unverified"
    }
  }

  const truncatedContent = article.content?.substring(0, 250) || ""
  const hasMoreContent = article.content?.length > 250

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border border-[#0077b6]/20 hover:border-[#0077b6]/40 transition-all duration-300 hover:shadow-md group news-card">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-lg font-semibold group-hover:text-[#0077b6] transition-colors duration-300">
              {article.title}
            </h3>
            <Badge variant="outline" className={getStatusColor(factCheck.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(factCheck.status)}
                {getStatusText(factCheck.status)}
              </span>
            </Badge>
          </div>
          {article.hashtags && article.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {article.hashtags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-[#0077b6]/10 hover:bg-[#0077b6]/20 transition-all duration-300 hover:scale-105"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          {article.publishedAt && (
            <div className="text-sm text-muted-foreground mt-1">
              Published: {new Date(article.publishedAt).toLocaleDateString("en-GB")}
            </div>
          )}
          {article.author && <div className="text-sm text-muted-foreground">By: {article.author}</div>}
        </CardHeader>

        <CardContent className="pb-3">
          {article.urlToImage && (
            <div className="mb-4 rounded-md overflow-hidden">
              <img
                src={article.urlToImage || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            </div>
          )}

          <p className="text-foreground">
            {expanded ? article.content : truncatedContent}
            {!expanded && hasMoreContent && "..."}
          </p>

          {hasMoreContent && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-muted-foreground p-0 h-auto hover:text-[#0077b6]"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <span className="flex items-center">
                  Show less <ChevronUp className="ml-1 h-4 w-4" />
                </span>
              ) : (
                <span className="flex items-center">
                  Read more <ChevronDown className="ml-1 h-4 w-4" />
                </span>
              )}
            </Button>
          )}

          <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span>Source: {article.source}</span>
              {(article.sourceUrl || article.url) && (
                <a
                  href={article.sourceUrl || article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#0077b6] hover:underline hover:text-[#005f8d] transition-all duration-300"
                >
                  <motion.span whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </motion.span>
                </a>
              )}
            </div>
            {article.engagementStats && <span>{article.engagementStats.tweets.toLocaleString()} tweets</span>}
          </div>

          {article.engagementStats?.botPercentage && (
            <div className="mt-1 text-sm text-orange-600 dark:text-orange-400">
              Bot-like activity: {article.engagementStats.botPercentage}% of engagement
            </div>
          )}
        </CardContent>

        <Separator />

        <CardFooter className="pt-3 flex justify-between">
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all duration-200 hover:bg-[#0077b6]/10 border-[#0077b6]/30 hover:border-[#0077b6]/60"
                    onClick={() => {
                      if (isApiArticle && !aiFactCheck) {
                        performAIFactCheck()
                      }
                    }}
                  >
                    {isFactChecking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Fact Check"
                    )}
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Fact Check Results</DialogTitle>
                  <DialogDescription>Detailed analysis of this news item</DialogDescription>
                </DialogHeader>
                <FactCheckResult article={{ ...article, factCheck }} aiFactCheck={aiFactCheck} />
              </DialogContent>
            </Dialog>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTranslateDialog(true)}
                className="transition-all duration-200 hover:bg-[#0077b6]/10 border-[#0077b6]/30 hover:border-[#0077b6]/60"
              >
                <Globe className="mr-1 h-4 w-4" /> Translate
              </Button>
            </motion.div>
          </div>

          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareDialog(true)}
                className="text-[#0077b6] hover:text-[#005f8d] hover:bg-[#0077b6]/10 transition-all duration-200"
              >
                <Share2 className="mr-1 h-4 w-4" /> Share
              </Button>
            </motion.div>
          </div>
        </CardFooter>

        {/* Add the comment section after the CardFooter */}
        <div className="px-4 pb-4">
          <CommentSection articleId={article.title} articleTitle={article.title} />
        </div>

        <TranslationDialog
          open={showTranslateDialog}
          onOpenChange={setShowTranslateDialog}
          title={article.title}
          content={article.content || ""}
        />

        <ShareDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          article={{
            ...article,
            url: article.url || article.sourceUrl || window.location.href,
          }}
        />
      </Card>
    </motion.div>
  )
}
