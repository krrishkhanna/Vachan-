import { NextResponse } from "next/server"
import { logClaimVerification, normalizeVerdict } from "@/lib/claim-logging"
import { rateLimitByIp } from "@/lib/rate-limit"
import { verifyClaim } from "@/lib/verify-claim"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(req: Request) {
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"

  const rateLimit = await rateLimitByIp(ipAddress)

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Try again in a minute.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    )
  }

  try {
    const { claim, language } = await req.json()

    if (typeof claim !== "string" || !claim.trim()) {
      return NextResponse.json({ error: "The `claim` field is required." }, { status: 400 })
    }

    const result = await verifyClaim({
      claimText: claim.trim(),
      language: typeof language === "string" ? language : undefined,
    })

    await persistClaimLog({
      claimText: claim.trim(),
      factCheckResult: result,
    })

    return NextResponse.json(
      {
        verdict: normalizeVerdict(result.classification),
        confidence: Number((result.confidence / 100).toFixed(4)),
        sources: result.sources.map((source) => source.url),
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    )
  } catch (error) {
    console.error("Error in verify API:", error)
    return NextResponse.json({ error: "Failed to verify claim" }, { status: 500 })
  }
}

async function persistClaimLog({
  claimText,
  factCheckResult,
}: {
  claimText: string
  factCheckResult: Awaited<ReturnType<typeof verifyClaim>>
}) {
  try {
    await logClaimVerification({
      claimText,
      verdict: factCheckResult.classification,
      confidenceScore: factCheckResult.confidence,
      languageDetected: factCheckResult.languageDetected,
      sourceUrl: null,
    })
  } catch (error) {
    console.error("Failed to log verified claim from /api/verify:", error)
  }
}
