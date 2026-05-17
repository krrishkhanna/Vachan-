"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Twitter, Linkedin, Mail, Copy, Check } from "lucide-react"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  article: {
    title: string
    content?: string
    source: string
    sourceUrl?: string
    url?: string
    factCheck?: {
      status: string
      details: string
    }
  }
}

export function ShareDialog({ open, onOpenChange, article }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = article.url || article.sourceUrl || window.location.href
  const shareTitle = article.title
  const shareText = `${shareTitle} - Fact check: ${article.factCheck?.status.toUpperCase()}. Source: ${article.source}`

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    // Make sure the URL is properly encoded
    const encodedShareUrl = encodeURIComponent(shareUrl)
    const encodedShareText = encodeURIComponent(shareText)

    let shareLink = ""

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedShareUrl}`
        break
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&quote=${encodedShareText}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`
        break
      case "email":
        shareLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`
        break
      default:
        shareLink = shareUrl
    }

    // Open in a new window with proper size
    const width = 550
    const height = 420
    const left = Math.round((window.innerWidth - width) / 2)
    const top = Math.round((window.innerHeight - height) / 2)

    if (platform === "email") {
      window.location.href = shareLink
    } else {
      window.open(
        shareLink,
        `share_${platform}`,
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`,
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this article</DialogTitle>
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
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Share on Twitter</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full bg-[#4267B2] hover:bg-[#3b5998] text-white"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Share on Facebook</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full bg-[#0077B5] hover:bg-[#006699] text-white"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">Share on LinkedIn</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full bg-[#D44638] hover:bg-[#c23b2e] text-white"
                onClick={() => handleShare("email")}
              >
                <Mail className="h-5 w-5" />
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
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
  )
}

