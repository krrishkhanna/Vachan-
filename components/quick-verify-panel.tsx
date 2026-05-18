"use client"

import { useState } from "react"
import { ArrowUpRight, Loader2, Link2, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface VerifyResponse {
  verdict: "true" | "false" | "misleading" | "unverifiable"
  confidence: number
  sources: string[]
}

const starterClaims = [
  "This video proves a government order was issued today.",
  "A hospital has confirmed a new miracle cure for diabetes.",
  "This screenshot shows an official election result announcement.",
]

export function QuickVerifyPanel() {
  const [claim, setClaim] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<VerifyResponse | null>(null)
  const { toast } = useToast()

  const verifyClaim = async () => {
    if (!claim.trim()) {
      toast({
        title: "Enter a claim",
        description: "Paste a headline, quote, screenshot summary, or viral message to verify it.",
        variant: "destructive",
      })
      return
    }

    setIsChecking(true)
    setResult(null)

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          claim: claim.trim(),
          language: "en",
        }),
      })

      if (!response.ok) {
        throw new Error("Verification failed")
      }

      const payload = (await response.json()) as VerifyResponse
      setResult(payload)
    } catch (error) {
      console.error(error)
      toast({
        title: "Verification failed",
        description: "The public verify endpoint could not process this claim right now.",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="overflow-hidden rounded-[30px] border border-[#0077b6]/18 bg-white/82 shadow-[0_18px_60px_rgba(0,119,182,0.10)] backdrop-blur dark:bg-slate-950/55">
      <CardHeader className="pb-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="rounded-2xl bg-[#0077b6] p-3 text-white shadow-[0_12px_28px_rgba(0,119,182,0.22)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <Badge className="bg-[#0077b6]/10 text-[#0077b6] hover:bg-[#0077b6]/10">Live public tool</Badge>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Quick verify</CardTitle>
        <CardDescription>
          Paste a claim from a post, message, article, or screenshot summary and get a public verdict with sources.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={claim}
          onChange={(event) => setClaim(event.target.value)}
          placeholder="Paste a claim here. Example: This video proves a new government order was issued today."
          className="min-h-[120px] rounded-2xl border-[#0077b6]/15 bg-white/70 p-4 text-sm leading-7 dark:bg-slate-950/50"
        />

        <div className="flex flex-wrap gap-2">
          {starterClaims.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => setClaim(starter)}
              className="rounded-full border border-[#0077b6]/14 bg-[#0077b6]/6 px-3 py-1.5 text-xs text-slate-700 transition hover:border-[#0077b6]/35 hover:bg-[#0077b6]/10 dark:text-slate-200"
            >
              {starter}
            </button>
          ))}
        </div>

        <Button onClick={verifyClaim} disabled={isChecking} className="w-full bg-[#0077b6] hover:bg-[#005f8d]">
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying claim
            </>
          ) : (
            "Run public verification"
          )}
        </Button>

        {result && (
          <div className="rounded-[24px] border border-[#0077b6]/14 bg-[#0077b6]/4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Verdict</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{formatVerdict(result.verdict)}</p>
              </div>
              <Badge variant="outline" className={getVerdictClass(result.verdict)}>
                {Math.round(result.confidence * 100)}% confidence
              </Badge>
            </div>

            {result.sources.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Source trails</p>
                {result.sources.slice(0, 3).map((source) => (
                  <a
                    key={source}
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-[#0077b6]/12 bg-white/70 px-3 py-2 text-sm text-slate-700 transition hover:border-[#0077b6]/30 dark:bg-slate-950/45 dark:text-slate-200"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Link2 className="h-4 w-4 shrink-0 text-[#0077b6]" />
                      <span className="truncate">{source}</span>
                    </span>
                    <ArrowUpRight className="ml-3 h-4 w-4 shrink-0 text-[#0077b6]" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatVerdict(verdict: VerifyResponse["verdict"]) {
  switch (verdict) {
    case "true":
      return "True"
    case "false":
      return "False"
    case "misleading":
      return "Misleading"
    default:
      return "Unverifiable"
  }
}

function getVerdictClass(verdict: VerifyResponse["verdict"]) {
  switch (verdict) {
    case "true":
      return "border-green-200 bg-green-50 text-green-700"
    case "false":
      return "border-red-200 bg-red-50 text-red-700"
    case "misleading":
      return "border-amber-200 bg-amber-50 text-amber-700"
    default:
      return "border-slate-200 bg-slate-50 text-slate-700"
  }
}
