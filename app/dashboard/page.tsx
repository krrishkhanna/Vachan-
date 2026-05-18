"use client"

import { useState, useEffect } from "react"
import { VachanLogo } from "@/components/vachan-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Download, MoonIcon, SunIcon, Globe2, PieChart as PieChartIcon, RefreshCw, Shield, TrendingUp } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import Papa from "papaparse"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface DashboardStats {
  totalClaims: number
  distinctLanguages: number
  verdictBreakdown: Array<{
    verdict: "true" | "false" | "misleading" | "unverifiable"
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
  latestClaims: Array<{
    claim_text: string
    verdict: "true" | "false" | "misleading" | "unverifiable"
    confidence_score: number
    created_at: string
  }>
  generatedAt: string
}

type VerdictBreakdownItem = DashboardStats["verdictBreakdown"][number]
type LanguageItem = DashboardStats["topLanguages"][number]
type RecentClaimItem = DashboardStats["latestClaims"][number]

export default function DashboardPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) {
      return
    }

    let isActive = true

    const loadDashboard = async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      try {
        const response = await fetch("/api/dashboard", {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Could not load dashboard data")
        }

        const dashboardStats = (await response.json()) as DashboardStats

        if (!isActive) {
          return
        }

        setStats(dashboardStats)
        setError(null)
      } catch (loadError) {
        if (!isActive) {
          return
        }

        console.error(loadError)
        setError("Dashboard data is unavailable right now. Make sure Supabase claim read access is enabled.")
      } finally {
        if (!isActive) {
          return
        }

        setIsLoading(false)
        setIsRefreshing(false)
      }
    }

    loadDashboard()
    const refreshInterval = window.setInterval(() => {
      loadDashboard(true)
    }, 60_000)

    return () => {
      isActive = false
      window.clearInterval(refreshInterval)
    }
  }, [mounted])

  if (!mounted) {
    return null
  }

  const leadingVerdict = (stats?.verdictBreakdown ?? []).reduce<VerdictBreakdownItem>(
    (currentLeader: VerdictBreakdownItem, verdict: VerdictBreakdownItem) =>
      verdict.count > currentLeader.count ? verdict : currentLeader,
    stats?.verdictBreakdown[0] ?? {
      verdict: "unverifiable" as const,
      label: "Unverifiable",
      count: 0,
      fill: "#64748b",
    },
  )

  const distinctLanguageCount = stats?.distinctLanguages ?? 0
  const totalLanguageMentions =
    stats?.topLanguages.reduce((sum: number, entry: LanguageItem) => sum + entry.count, 0) ?? 0

  const exportLatestClaims = async () => {
    setIsExporting(true)

    try {
      const { data, error: exportError } = await supabase
        .from("claims")
        .select("claim_text, verdict, confidence_score, language_detected, created_at")
        .order("created_at", { ascending: false })
        .range(0, 499)

      if (exportError) {
        throw exportError
      }

      const csv = Papa.unparse(data ?? [], {
        columns: ["claim_text", "verdict", "confidence_score", "language_detected", "created_at"],
      })

      const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const downloadUrl = URL.createObjectURL(csvBlob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = "claims.csv"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)
    } catch (exportError) {
      console.error("Failed to export claims CSV:", exportError)
      toast({
        title: "CSV export failed",
        description: "Could not export the latest claims right now. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div
      className={`min-h-screen ${
        resolvedTheme === "dark"
          ? "bg-gradient-to-br from-[#001a2c] via-background to-[#001a2c]"
          : "bg-gradient-to-br from-[#e6f4ff] via-background to-[#e6f4ff]"
      }`}
    >
      <header className="glass border-b border-border sticky top-0 z-10 backdrop-blur-md bg-background/70">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <VachanLogo />
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            <Link href="/main">
              <Button variant="outline" size="sm">
                Back to News
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Claims Verification Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Live public analytics from the Supabase `claims` table, refreshing every 60 seconds.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <Badge className="bg-[#0077b6]/10 text-[#0077b6] hover:bg-[#0077b6]/20">
              <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Auto-refresh 60s
            </Badge>
            <Button variant="outline" onClick={exportLatestClaims} disabled={isExporting} className="border-[#0077b6]/30 hover:border-[#0077b6]/60">
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
            <Link href="/main">
              <Button className="bg-[#0077b6] hover:bg-[#005f8d]">
                <Shield className="mr-2 h-4 w-4" />
                Back to Fact Checks
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Claims Verified</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "..." : stats?.totalClaims.toLocaleString("en-IN") ?? 0}</div>
              <p className="text-sm text-muted-foreground mt-1">Every verified claim stored in Supabase.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Leading Verdict</CardTitle>
              <CardDescription>Most common outcome</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "..." : leadingVerdict.label}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {isLoading ? "Loading verdict mix..." : `${leadingVerdict.count.toLocaleString("en-IN")} claims`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Top Languages</CardTitle>
              <CardDescription>Unique languages across all claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "..." : distinctLanguageCount}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {isLoading ? "Loading language stats..." : `${totalLanguageMentions.toLocaleString("en-IN")} claims represented in the top 5`}
              </p>
            </CardContent>
          </Card>
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300">Dashboard Unavailable</CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-[#0077b6]" />
                    Verdict Breakdown
                  </CardTitle>
                  <CardDescription>All-time distribution of claim outcomes</CardDescription>
                </CardHeader>
                <CardContent className="h-[360px]">
                  {isLoading ? (
                    <DashboardLoadingCopy message="Loading verdict distribution..." />
                  ) : (stats?.totalClaims ?? 0) === 0 ? (
                    <DashboardLoadingCopy message="No claims have been logged yet." />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.verdictBreakdown}
                          dataKey="count"
                          nameKey="label"
                          innerRadius={85}
                          outerRadius={125}
                          paddingAngle={3}
                        >
                          {stats?.verdictBreakdown.map((entry: VerdictBreakdownItem) => (
                            <Cell key={entry.verdict} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => value.toLocaleString("en-IN")} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe2 className="h-5 w-5 text-[#0077b6]" />
                    Top 5 Languages
                  </CardTitle>
                  <CardDescription>Most common detected languages across all verified claims</CardDescription>
                </CardHeader>
                <CardContent className="h-[360px]">
                  {isLoading ? (
                    <DashboardLoadingCopy message="Loading language rankings..." />
                  ) : !stats?.topLanguages.length ? (
                    <DashboardLoadingCopy message="No language detections are available yet." />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.topLanguages} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis dataKey="label" type="category" width={90} tickLine={false} axisLine={false} />
                        <Tooltip formatter={(value: number) => value.toLocaleString("en-IN")} />
                        <Bar dataKey="count" radius={[0, 10, 10, 0]} fill="#0077b6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#0077b6]" />
                  Claims Per Day
                </CardTitle>
                <CardDescription>Last 30 days of verified claim volume</CardDescription>
              </CardHeader>
              <CardContent className="h-[360px]">
                {isLoading ? (
                  <DashboardLoadingCopy message="Loading 30-day trend..." />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.claimsPerDay}>
                      <XAxis dataKey="label" minTickGap={24} />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        formatter={(value: number) => [`${value.toLocaleString("en-IN")} claims`, "Verified Claims"]}
                        labelFormatter={(label: string) => `Date: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Verified Claims"
                        stroke="#0077b6"
                        strokeWidth={3}
                        dot={{ r: 3, fill: "#0077b6" }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latest 10 Claims</CardTitle>
                <CardDescription>Most recently verified claims from the public `claims` table</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <DashboardLoadingCopy message="Loading recent claims..." />
                ) : !stats?.latestClaims.length ? (
                  <DashboardLoadingCopy message="No claims have been logged yet." />
                ) : (
                  <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full min-w-[720px] text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">Claim</th>
                          <th className="px-4 py-3 text-left font-medium">Verdict</th>
                          <th className="px-4 py-3 text-left font-medium">Confidence</th>
                          <th className="px-4 py-3 text-left font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.latestClaims.map((claim: RecentClaimItem, index: number) => (
                          <tr key={`${claim.created_at}-${index}`} className="border-t align-top">
                            <td className="px-4 py-3 max-w-[420px]">
                              <p className="line-clamp-2">{claim.claim_text}</p>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className={getVerdictBadgeClass(claim.verdict)}>
                                {formatVerdictLabel(claim.verdict)}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {Math.round(Number(claim.confidence_score) * 100)}%
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {new Date(claim.created_at).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm text-muted-foreground">
              <span>Public analytics powered by anonymous Supabase reads from the `claims` table.</span>
              <span>
                {stats?.generatedAt
                  ? `Last refreshed: ${new Date(stats.generatedAt).toLocaleTimeString("en-IN")}`
                  : "Waiting for first refresh..."}
              </span>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2025 Vachan. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="/privacy" className="text-muted-foreground hover:text-primary text-sm">
                Privacy Policy
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-primary text-sm">
                Terms of Service
              </a>
              <a href="/contact" className="text-muted-foreground hover:text-primary text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function DashboardLoadingCopy({ message }: { message: string }) {
  return <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{message}</div>
}

function formatVerdictLabel(verdict: RecentClaimItem["verdict"]) {
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

function getVerdictBadgeClass(verdict: RecentClaimItem["verdict"]) {
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
