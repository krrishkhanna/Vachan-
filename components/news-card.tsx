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
      <Card className="group overflow-hidden rounded-[28px] border border-[#0077b6]/14 bg-white/84 shadow-[0_20px_60px_rgba(0,119,182,0.08)] transition-all duration-300 hover:border-[#0077b6]/30 hover:shadow-[0_24px_70px_rgba(0,119,182,0.13)] dark:bg-slate-950/55">
        <CardHeader className="pb-4">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <span className="rounded-full bg-[#0077b6]/10 px-3 py-1 text-[#0077b6]">{article.source}</span>
            {article.publishedAt && <span>{new Date(article.publishedAt).toLocaleDateString("en-GB")}</span>}
            {article.author && <span>by {article.author}</span>}
          </div>

          <div className="flex justify-between items-start gap-4">
            <h3 className="text-2xl font-bold leading-tight tracking-[-0.03em] text-slate-900 transition-colors duration-300 group-hover:text-[#0077b6] dark:text-white">
              {article.title}
            </h3>
            <Badge variant="outline" className={`${getStatusColor(factCheck.status)} shrink-0 border px-3 py-1`}>
              <span className="flex items-center gap-1.5">
                {getStatusIcon(factCheck.status)}
                {getStatusText(factCheck.status)}
              </span>
            </Badge>
          </div>
          {article.hashtags && article.hashtags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.hashtags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="rounded-full border border-[#0077b6]/10 bg-[#0077b6]/8 px-3 py-1 text-[11px] font-medium text-slate-700 transition-all duration-300 hover:bg-[#0077b6]/15 dark:text-slate-200"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="pb-4">
          {article.urlToImage && (
            <div className="mb-5 overflow-hidden rounded-[22px]">
              <img
                src={article.urlToImage || "/placeholder.svg"}
                alt={article.title}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            </div>
          )}

          <p className="text-[15px] leading-7 text-slate-700 dark:text-slate-200">
            {expanded ? article.content : truncatedContent}
            {!expanded && hasMoreContent && "..."}
          </p>

          {hasMoreContent && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 h-auto p-0 text-sm font-medium text-muted-foreground hover:text-[#0077b6]"
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

          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-[#0077b6]/10 bg-[#0077b6]/4 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="font-medium">Source link</span>
              {(article.sourceUrl || article.url) && (
                <a
                  href={article.sourceUrl || article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#0077b6] transition-all duration-300 hover:text-[#005f8d] hover:underline"
                >
                  <motion.span whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </motion.span>
                </a>
              )}
            </div>
            {article.engagementStats && (
              <span className="font-medium">{article.engagementStats.tweets.toLocaleString("en-IN")} mentions</span>
            )}
          </div>

          {article.engagementStats?.botPercentage && (
            <div className="mt-2 text-sm text-orange-600 dark:text-orange-400">
              Suspicious amplification: {article.engagementStats.botPercentage}% of engagement appears bot-like
            </div>
          )}
        </CardContent>

        <Separator />

        <CardFooter className="flex justify-between gap-4 pt-4">
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-[#0077b6] transition-all duration-200 hover:bg-[#005f8d]"
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
                className="border-[#0077b6]/20 transition-all duration-200 hover:border-[#0077b6]/50 hover:bg-[#0077b6]/8"
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
                className="text-[#0077b6] transition-all duration-200 hover:bg-[#0077b6]/10 hover:text-[#005f8d]"
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
