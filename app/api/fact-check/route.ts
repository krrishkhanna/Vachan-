import { NextResponse } from "next/server"
import { logClaimVerification } from "@/lib/claim-logging"
import { verifyClaim } from "@/lib/verify-claim"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(req: Request) {
  try {
    const { text, title, source, sourceUrl } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided for fact-checking" }, { status: 400 })
    }

    const factCheckResult = await verifyClaim({
      claimText: text,
      title,
      source,
      sourceUrl,
    })

    await persistClaimLog({
      claimText: text,
      sourceUrl,
      factCheckResult,
    })

    return NextResponse.json({
      ...factCheckResult,
      modelUsed: "gemini-pro",
      analysisTime: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in fact-checking API:", error)
    return NextResponse.json({ error: "Failed to process fact-checking request" }, { status: 500 })
  }
}

async function persistClaimLog({
  claimText,
  sourceUrl,
  factCheckResult,
}: {
  claimText: string
  sourceUrl?: string | null
  factCheckResult: Awaited<ReturnType<typeof verifyClaim>>
}) {
  try {
    await logClaimVerification({
      claimText,
      verdict: factCheckResult.classification,
      confidenceScore: factCheckResult.confidence,
      languageDetected: factCheckResult.languageDetected,
      sourceUrl: sourceUrl || factCheckResult.sources[0]?.url || null,
    })
  } catch (error) {
    console.error("Failed to log verified claim:", error)
  }
}
