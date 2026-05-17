import { supabase } from "@/lib/supabase"

type ClaimVerdict = "true" | "false" | "misleading" | "unverifiable"

interface ClaimRow {
  verdict: ClaimVerdict
  language_detected: string
  created_at: string
}

export interface DashboardStats {
  totalClaims: number
  distinctLanguages: number
  verdictBreakdown: Array<{
    verdict: ClaimVerdict
    label: string
    count: number
    fill: string
  }>
  claimsPerDay: Array<{
    date: string
    label: string
    count: number
  }>
  topLanguages: Array<{
    language: string
    label: string
    count: number
  }>
  generatedAt: string
}

export interface DashboardExportClaim {
  claim_text: string
  verdict: ClaimVerdict
  confidence_score: number
  language_detected: string
  created_at: string
}

const PAGE_SIZE = 1000

const VERDICT_META: Record<ClaimVerdict, { label: string; fill: string }> = {
  true: { label: "True", fill: "#16a34a" },
  false: { label: "False", fill: "#dc2626" },
  misleading: { label: "Misleading", fill: "#f59e0b" },
  unverifiable: { label: "Unverifiable", fill: "#64748b" },
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  mr: "Marathi",
  or: "Odia",
  pa: "Punjabi",
  ta: "Tamil",
  te: "Telugu",
  unknown: "Unknown",
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const totalClaims = await fetchClaimCount()
  const claimRows = await fetchAllClaimRows()
  const topLanguagesSummary = buildTopLanguages(claimRows)

  return {
    totalClaims,
    distinctLanguages: topLanguagesSummary.distinctLanguages,
    verdictBreakdown: buildVerdictBreakdown(claimRows),
    claimsPerDay: buildClaimsPerDay(claimRows),
    topLanguages: topLanguagesSummary.topLanguages,
    generatedAt: new Date().toISOString(),
  }
}

async function fetchClaimCount() {
  const { count, error } = await supabase.from("claims").select("*", { count: "exact", head: true })

  if (error) {
    throw error
  }

  return count ?? 0
}

async function fetchAllClaimRows() {
  const allRows: ClaimRow[] = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from("claims")
      .select("verdict, language_detected, created_at")
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      break
    }

    allRows.push(...(data as ClaimRow[]))

    if (data.length < PAGE_SIZE) {
      break
    }

    from += PAGE_SIZE
  }

  return allRows
}

function buildVerdictBreakdown(rows: ClaimRow[]) {
  const verdictCounts = rows.reduce<Record<ClaimVerdict, number>>(
    (accumulator, row) => {
      const verdict = normalizeVerdict(row.verdict)
      accumulator[verdict] += 1
      return accumulator
    },
    {
      true: 0,
      false: 0,
      misleading: 0,
      unverifiable: 0,
    },
  )

  return (Object.keys(VERDICT_META) as ClaimVerdict[]).map((verdict) => ({
    verdict,
    label: VERDICT_META[verdict].label,
    count: verdictCounts[verdict],
    fill: VERDICT_META[verdict].fill,
  }))
}

function buildClaimsPerDay(rows: ClaimRow[]) {
  const dateBuckets = new Map<string, number>()
  const today = new Date()
  const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))

  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(utcToday)
    date.setUTCDate(utcToday.getUTCDate() - offset)
    dateBuckets.set(date.toISOString().slice(0, 10), 0)
  }

  rows.forEach((row) => {
    const bucketKey = new Date(row.created_at).toISOString().slice(0, 10)

    if (dateBuckets.has(bucketKey)) {
      dateBuckets.set(bucketKey, (dateBuckets.get(bucketKey) ?? 0) + 1)
    }
  })

  return Array.from(dateBuckets.entries()).map(([date, count]) => ({
    date,
    label: formatChartDate(date),
    count,
  }))
}

function buildTopLanguages(rows: ClaimRow[]) {
  const languageCounts = rows.reduce<Map<string, number>>((accumulator, row) => {
    const language = normalizeLanguage(row.language_detected)
    accumulator.set(language, (accumulator.get(language) ?? 0) + 1)
    return accumulator
  }, new Map<string, number>())

  const topLanguages = Array.from(languageCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language, count]) => ({
      language,
      label: formatLanguageLabel(language),
      count,
    }))

  return {
    distinctLanguages: languageCounts.size,
    topLanguages,
  }
}

function normalizeVerdict(verdict: string): ClaimVerdict {
  switch (verdict) {
    case "true":
    case "false":
    case "misleading":
    case "unverifiable":
      return verdict
    default:
      return "unverifiable"
  }
}

function normalizeLanguage(language: string | null | undefined) {
  const trimmedLanguage = language?.trim().toLowerCase()
  return trimmedLanguage || "unknown"
}

function formatChartDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`))
}

export function formatLanguageLabel(language: string) {
  return LANGUAGE_LABELS[language] ?? language.toUpperCase()
}

export async function fetchLatestClaimsForExport(limit = 500) {
  const { data, error } = await supabase
    .from("claims")
    .select("claim_text, verdict, confidence_score, language_detected, created_at")
    .order("created_at", { ascending: false })
    .range(0, Math.max(0, limit - 1))

  if (error) {
    throw error
  }

  return (data ?? []) as DashboardExportClaim[]
}
