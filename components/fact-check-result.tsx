"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, AlertTriangle, AlertCircle, ExternalLink, ThumbsDown, Share2, Copy, CheckIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

interface FactCheckResultProps {
  article: {
    title: string
    content: string
    factCheck: {
      status: "true" | "false" | "misleading" | "unverified" | "unverifiable"
      details: string
      sources: string[]
    }
  }
  aiFactCheck?: {
    classification: string
    confidence: number
    explanation: string
    languageDetected?: string
    sources?: Array<{
      title: string
      url: string
    }>
    modelUsed: string
    analysisTime: string
    keywords?: {
      factual: string[]
      questionable: string[]
    }
  }
}

export function FactCheckResult({ article, aiFactCheck }: FactCheckResultProps) {
  const [showDisagreeForm, setShowDisagreeForm] = useState(false)
  const [disagreeReason, setDisagreeReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const normalizedStatus =
    aiFactCheck?.classification === "unverifiable" ? "unverified" : aiFactCheck?.classification || article.factCheck.status

  const displaySources =
    aiFactCheck?.sources && aiFactCheck.sources.length > 0
      ? aiFactCheck.sources.slice(0, 3)
      : article.factCheck.sources.slice(0, 3).map((source) => ({
          title: source,
          url: generateSourceUrl(source),
        }))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "true":
        return <Check className="h-6 w-6 text-green-500" />
      case "false":
        return <X className="h-6 w-6 text-red-500" />
      case "misleading":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "true":
        return "bg-green-100 text-green-800"
      case "false":
        return "bg-red-100 text-red-800"
      case "misleading":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
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
        return "Unverifiable"
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "true":
        return "This information has been verified by multiple reliable sources."
      case "false":
        return "This information has been determined to be false based on fact-checking."
      case "misleading":
        return "This information contains some truth but is presented in a misleading way."
      default:
        return "This information could not be verified confidently."
    }
  }

  const generateSourceUrl = (source: string) => {
    // Extract organization name from the source
    const match = source.match(
      /^(.*?)\s+(?:official\s+)?(?:statement|press\s+release|clarification|report|analysis|validation\s+study)/i,
    )
    const organization = match ? match[1].trim() : source.split("(")[0].trim()

    // Generate a plausible URL based on the organization name
    if (organization.toLowerCase().includes("ministry")) {
      return `https://www.${organization.toLowerCase().replace(/\s+of\s+|\s+and\s+|\s+/g, "-")}.gov.in/`
    } else if (organization.toLowerCase().includes("supreme court")) {
      return "https://main.sci.gov.in/"
    } else if (organization.toLowerCase().includes("isro")) {
      return "https://www.isro.gov.in/"
    } else if (
      organization.toLowerCase().includes("pib") ||
      organization.toLowerCase().includes("press information bureau")
    ) {
      return "https://pib.gov.in/"
    } else if (organization.toLowerCase().includes("who")) {
      return "https://www.who.int/india"
    } else if (organization.toLowerCase().includes("digital forensics")) {
      return "https://dflab.in/"
    } else if (organization.toLowerCase().includes("election commission")) {
      return "https://eci.gov.in/"
    } else if (organization.toLowerCase().includes("aiims")) {
      return "https://www.aiims.edu/"
    } else if (organization.toLowerCase().includes("icmr")) {
      return "https://main.icmr.nic.in/"
    } else if (organization.toLowerCase().includes("sebi")) {
      return "https://www.sebi.gov.in/"
    } else if (organization.toLowerCase().includes("cyber")) {
      return "https://www.cybercrime.gov.in/"
    } else if (organization.toLowerCase().includes("bar council")) {
      return "https://www.barcouncilofindia.org/"
    } else if (organization.toLowerCase().includes("world bank")) {
      return "https://www.worldbank.org/en/country/india"
    } else if (organization.toLowerCase().includes("rbi") || organization.toLowerCase().includes("reserve bank")) {
      return "https://www.rbi.org.in/"
    } else if (organization.toLowerCase().includes("nasa")) {
      return "https://www.nasa.gov/"
    } else {
      return `https://toolbox.google.com/factcheck/explorer/search/${encodeURIComponent(source)}`
    }
  }

  const handleDisagree = () => {
    setShowDisagreeForm(true)
  }

  const submitDisagreement = async () => {
    if (!disagreeReason.trim()) {
      toast({
        title: "Please provide a reason",
        description: "Tell us why you disagree with this fact-check result.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // In a real app, you would send this to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Feedback submitted",
        description: "Thank you for your input. Our fact-checkers will review your feedback.",
      })

      setShowDisagreeForm(false)
      setDisagreeReason("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Create share data
  const shareText = `Fact Check: ${getStatusText(normalizedStatus)} - ${article.title}`
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied to clipboard",
      description: "The fact check has been copied to your clipboard.",
    })
  }

  // Handle share button click - open dialog instead of trying to use Web Share API directly
  const handleShare = () => {
    setShowShareDialog(true)
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-start gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`p-3 rounded-full ${getStatusColor(normalizedStatus)}`}>
          {getStatusIcon(normalizedStatus)}
        </div>
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {getStatusText(normalizedStatus)}
            <Badge variant="outline" className={getStatusColor(normalizedStatus)}>
              {getStatusText(normalizedStatus)}
            </Badge>
          </h3>
          <p className="text-gray-600 mt-1">{getStatusDescription(normalizedStatus)}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border border-[#0077b6]/20 hover:border-[#0077b6]/40 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr] mb-6">
              <div className="rounded-xl border border-[#0077b6]/20 bg-[#0077b6]/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Verdict</span>
                  <Badge variant="outline" className={getStatusColor(normalizedStatus)}>
                    {getStatusText(normalizedStatus)}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{getStatusDescription(normalizedStatus)}</p>
              </div>

              <div className="rounded-xl border border-[#0077b6]/20 bg-background p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Confidence Score</span>
                  <span className="font-semibold">{aiFactCheck?.confidence ?? "N/A"}{aiFactCheck ? "%" : ""}</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      (aiFactCheck?.confidence ?? 0) >= 80
                        ? "bg-green-500"
                        : (aiFactCheck?.confidence ?? 0) >= 60
                          ? "bg-amber-500"
                          : "bg-gray-400"
                    }`}
                    style={{ width: `${aiFactCheck?.confidence ?? 0}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {aiFactCheck
                    ? "Higher percentages indicate stronger model confidence in the verdict."
                    : "Confidence becomes available after AI verification runs."}
                </p>
              </div>
            </div>

            <h4 className="font-semibold mb-2">Claim</h4>
            <p className="text-gray-700 mb-4">{article.title}</p>

            <h4 className="font-semibold mb-2">Analysis</h4>
            <p className="text-gray-700 mb-4">{aiFactCheck?.explanation || article.factCheck.details}</p>

            <h4 className="font-semibold mb-2">Supporting Sources</h4>
            <div className="space-y-3">
              {displaySources.map((source, index) => (
                <a
                  key={`${source.url}-${index}`}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between rounded-lg border border-[#0077b6]/15 p-3 hover:border-[#0077b6]/40 hover:bg-[#0077b6]/5 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{source.title}</p>
                    <p className="text-sm text-muted-foreground break-all">{source.url}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#0077b6] shrink-0 ml-3 mt-1" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gradient-to-r from-[#0077b6]/10 to-[#0077b6]/5 p-4 rounded-lg border border-[#0077b6]/20"
      >
        <h4 className="font-semibold text-[#0077b6] mb-2">How we fact-check</h4>
        <p className="text-[#0077b6]/90 text-sm">
          Our fact-checking process involves cross-referencing information with multiple reliable sources, consulting
          domain experts, and using AI-powered analysis to detect patterns of misinformation. Learn more about our
          methodology.
        </p>
      </motion.div>
      {aiFactCheck && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="border border-[#0077b6]/20 rounded-lg p-4 bg-gradient-to-r from-[#0077b6]/5 to-transparent"
        >
          <h3 className="text-lg font-semibold mb-3 text-[#0077b6]">AI-Powered Analysis</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Classification:</span>
              <Badge
                variant="outline"
                className={getStatusColor(aiFactCheck.classification)}
              >
                {aiFactCheck.classification === "true"
                  ? "Verified"
                  : aiFactCheck.classification === "false"
                    ? "False"
                    : aiFactCheck.classification === "misleading"
                      ? "Misleading"
                      : "Unverifiable"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Confidence:</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      aiFactCheck.confidence > 80
                        ? "bg-green-500"
                        : aiFactCheck.confidence > 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${aiFactCheck.confidence}%` }}
                  ></div>
                </div>
                <span>{aiFactCheck.confidence}%</span>
              </div>
            </div>

            <div>
              <span className="font-medium">Analysis:</span>
              <p className="mt-1 text-gray-700">{aiFactCheck.explanation}</p>
            </div>

            {aiFactCheck.keywords && (
              <div className="space-y-2">
                <span className="font-medium">Key Indicators:</span>

                {aiFactCheck.keywords.factual.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-sm text-gray-600">Factual:</span>
                    {aiFactCheck.keywords.factual.map((word, i) => (
                      <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {word}
                      </Badge>
                    ))}
                  </div>
                )}

                {aiFactCheck.keywords.questionable.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-sm text-gray-600">Questionable:</span>
                    {aiFactCheck.keywords.questionable.map((word, i) => (
                      <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {word}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-gray-500 mt-2">
              <span>Model: {aiFactCheck.modelUsed}</span>
              <span className="ml-4">Analyzed: {new Date(aiFactCheck.analysisTime).toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisagree}
            className="border-[#0077b6]/30 hover:border-[#0077b6]/60"
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Disagree with this fact-check
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share fact-check
          </Button>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this fact check</DialogTitle>
            <DialogDescription>Share this fact-checked article with your network</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="social" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="link">Copy Link</TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="mt-4">
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-[#1DA1F2] hover:bg-[#1a94df] text-white"
                  onClick={() => {
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
                      "share_twitter",
                      "width=550,height=420,toolbar=0,menubar=0,location=0",
                    )
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Share on Twitter</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-[#4267B2] hover:bg-[#3b5998] text-white"
                  onClick={() => {
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
                      "share_facebook",
                      "width=550,height=420,toolbar=0,menubar=0,location=0",
                    )
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Share on Facebook</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-[#0077B5] hover:bg-[#006699] text-white"
                  onClick={() => {
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                      "share_linkedin",
                      "width=550,height=420,toolbar=0,menubar=0,location=0",
                    )
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">Share on LinkedIn</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-[#D44638] hover:bg-[#c23b2e] text-white"
                  onClick={() => {
                    window.location.href = `mailto:?subject=${encodeURIComponent(`Fact Check: ${article.title}`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="sr-only">Share via Email</span>
                </Button>
              </div>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Sharing includes the article title, fact-check status, and source attribution.
              </div>
            </TabsContent>

            <TabsContent value="link" className="mt-4">
              <div className="flex items-center space-x-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <CheckIcon className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy link</span>
                </Button>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                This link will direct to the original source of the article with our fact-check information.
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {showDisagreeForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border border-[#0077b6]/20 rounded-lg p-4 bg-[#0077b6]/5"
        >
          <h3 className="text-lg font-semibold mb-2">Why do you disagree?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your feedback helps us improve our fact-checking process. Please provide specific details about why you
            think this fact-check is incorrect.
          </p>
          <Textarea
            placeholder="I disagree because..."
            value={disagreeReason}
            onChange={(e) => setDisagreeReason(e.target.value)}
            className="min-h-[120px] mb-4 border-[#0077b6]/30 focus-visible:ring-[#0077b6]/50"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDisagreeForm(false)}
              className="border-[#0077b6]/30 hover:border-[#0077b6]/60"
            >
              Cancel
            </Button>
            <Button onClick={submitDisagreement} disabled={isSubmitting} className="bg-[#0077b6] hover:bg-[#005f8d]">
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
