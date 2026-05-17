import { supabase } from "@/lib/supabase"

export type ClaimVerdict = "true" | "false" | "misleading" | "unverifiable"

type ClaimClassification = ClaimVerdict | "unverified"

interface ClaimLogInput {
  claimText: string
  verdict: ClaimClassification
  confidenceScore: number
  languageDetected?: string | null
  sourceUrl?: string | null
}

export function normalizeVerdict(verdict: string): ClaimVerdict {
  switch (verdict.toLowerCase()) {
    case "true":
      return "true"
    case "false":
      return "false"
    case "misleading":
      return "misleading"
    case "unverifiable":
    case "unverified":
    default:
      return "unverifiable"
  }
}

export function normalizeConfidenceScore(confidenceScore: number) {
  if (!Number.isFinite(confidenceScore)) {
    return 0
  }

  const normalizedScore = confidenceScore > 1 ? confidenceScore / 100 : confidenceScore
  return Math.min(1, Math.max(0, Number(normalizedScore.toFixed(4))))
}

export function detectLanguageFromText(text: string) {
  const trimmedText = text.trim()

  if (!trimmedText) {
    return "unknown"
  }

  if (/\p{Script=Devanagari}/u.test(trimmedText)) return "hi"
  if (/\p{Script=Bengali}/u.test(trimmedText)) return "bn"
  if (/\p{Script=Gujarati}/u.test(trimmedText)) return "gu"
  if (/\p{Script=Gurmukhi}/u.test(trimmedText)) return "pa"
  if (/\p{Script=Kannada}/u.test(trimmedText)) return "kn"
  if (/\p{Script=Malayalam}/u.test(trimmedText)) return "ml"
  if (/\p{Script=Oriya}/u.test(trimmedText)) return "or"
  if (/\p{Script=Tamil}/u.test(trimmedText)) return "ta"
  if (/\p{Script=Telugu}/u.test(trimmedText)) return "te"

  if (/[A-Za-z]/.test(trimmedText)) {
    return "en"
  }

  return "unknown"
}

export async function logClaimVerification({
  claimText,
  verdict,
  confidenceScore,
  languageDetected,
  sourceUrl,
}: ClaimLogInput) {
  const { error } = await supabase.from("claims").insert({
    claim_text: claimText,
    verdict: normalizeVerdict(verdict),
    confidence_score: normalizeConfidenceScore(confidenceScore),
    language_detected: languageDetected?.trim() || detectLanguageFromText(claimText),
    source_url: sourceUrl?.trim() || null,
  })

  if (error) {
    throw error
  }
}
