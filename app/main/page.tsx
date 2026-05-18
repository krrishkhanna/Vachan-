"use client"

import { useState, useEffect, useCallback } from "react"
import { NewsCard } from "@/components/news-card"
import { NewsFilters } from "@/components/news-filters"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getRandomArticles,
  fetchNewsFromAPI,
  fetchIndianNewsFromAPI,
  getArticlesByFactCheckStatus,
  filterArticles,
} from "@/lib/news-data"
import {
  MoonIcon,
  SunIcon,
  Globe,
  RefreshCw,
  ShieldCheck,
  BarChart3,
  Languages,
  Sparkles,
  Newspaper,
  Radar,
  ArrowUpRight,
} from "lucide-react"
import { useTheme } from "next-themes"
import { ReadabilitySettings } from "@/components/readability-settings"
import { EnhancedChatbot } from "@/components/enhanced-chatbot"
import { AuthButton } from "@/components/auth/auth-button"
import { VachanLogo } from "@/components/vachan-logo"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { motion } from "framer-motion"
import { ReaderModeToggle } from "@/components/reader-mode-toggle"
import { NotificationPanel } from "@/components/notification-panel"
import { CommunitiesSection } from "@/components/communities-section"
import { QuickVerifyPanel } from "@/components/quick-verify-panel"

const feedTabs = [
  { value: "trending", label: "Signal" },
  { value: "latest", label: "Latest" },
  { value: "verified", label: "Verified" },
  { value: "false", label: "False" },
  { value: "indian", label: "India" },
  { value: "world", label: "World" },
]

export default function MainPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [apiArticles, setApiArticles] = useState<any[]>([])
  const [indianArticles, setIndianArticles] = useState<any[]>([])
  const [verifiedArticles, setVerifiedArticles] = useState<any[]>([])
  const [falseArticles, setFalseArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { resolvedTheme, setTheme } = useTheme()
  const [readabilityOpen, setReadabilityOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    sources: [] as string[],
    factCheckStatus: [] as string[],
    date: undefined as Date | undefined,
  })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Get random articles from our dataset
    setArticles(getRandomArticles(10))

    // Get verified articles
    setVerifiedArticles(getArticlesByFactCheckStatus("true"))

    // Get false articles
    setFalseArticles(getArticlesByFactCheckStatus("false"))

    // Fetch articles from News API (World)
    fetchWorldNews()

    // Fetch articles from Indian News API
    fetchIndianNews()
  }, [])

  // Update the fetchWorldNews function to use MediaStack API
  const fetchWorldNews = useCallback(async (showToast = false) => {
    setIsLoading(true)
    try {
      const newsData = await fetchNewsFromAPI()
      setApiArticles(newsData)

      if (showToast) {
        toast({
          title: "Feed updated",
          description: "Latest world coverage has been loaded successfully.",
        })
      }
    } catch (error) {
      console.error("Error fetching world news:", error)
      if (showToast) {
        toast({
          title: "Error loading news",
          description: "Failed to load world coverage. Using fallback data.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Update the fetchIndianNews function to use MediaStack API
  const fetchIndianNews = useCallback(async (showToast = false) => {
    setIsLoading(true)
    try {
      const newsData = await fetchIndianNewsFromAPI()
      setIndianArticles(newsData)

      if (showToast) {
        toast({
          title: "India feed updated",
          description: "Latest Indian coverage has been loaded successfully.",
        })
      }
    } catch (error) {
      console.error("Error fetching Indian news:", error)
      if (showToast) {
        toast({
          title: "Error loading news",
          description: "Failed to load Indian coverage. Using fallback data.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Add a refresh function to get fresh news
  const refreshNews = () => {
    setIsLoading(true)
    toast({
      title: "Refreshing News",
      description: "Getting the latest news articles for you...",
    })

    // Fetch fresh news from both APIs
    fetchWorldNews(true)
    fetchIndianNews(true)
  }

  // Add a useEffect to refresh news every 30 minutes
  useEffect(() => {
    const refreshInterval = setInterval(
      () => {
        refreshNews()
      },
      30 * 60 * 1000,
    ) // 30 minutes

    return () => clearInterval(refreshInterval)
  }, [fetchWorldNews, fetchIndianNews])

  // Handle filter changes
  const handleFilterChange = (filters: {
    sources: string[]
    factCheckStatus: string[]
    date: Date | undefined
  }) => {
    console.log("Applying filters:", filters)
    setActiveFilters(filters)
  }

  // Open translation extension page
  const openTranslationExtension = () => {
    window.open(
      "https://chromewebstore.google.com/detail/immersive-translate-trans/bpoadfkcbjbfhfodiogcnhhhpibjhbnh?hl=en",
      "_blank",
    )
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative overflow-hidden">
          <Link href="/landing">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <VachanLogo />
            </motion.div>
          </Link>
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshNews}
                className="border-[#0077b6]/20 bg-white/70 transition-all duration-200 hover:border-[#0077b6]/50 hover:bg-white dark:bg-slate-950/50"
              >
                <RefreshCw className="mr-1 h-4 w-4" />
                Refresh feed
              </Button>
            </motion.div>
            <AuthButton />
            {/* Add the NotificationPanel here */}
            <NotificationPanel />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="transition-transform duration-200"
              >
                {resolvedTheme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </Button>
            </motion.div>
            <ReaderModeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReadabilityOpen(true)}
                className="border-[#0077b6]/20 bg-white/70 transition-all duration-200 hover:border-[#0077b6]/50 hover:bg-white dark:bg-slate-950/50"
              >
                Readability
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={openTranslationExtension}
                className="border-[#0077b6]/20 bg-white/70 transition-all duration-200 hover:border-[#0077b6]/50 hover:bg-white dark:bg-slate-950/50"
              >
                <Globe className="mr-1 h-4 w-4" /> Translate
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="default"
                size="sm"
                onClick={() => router.push("/chat")}
                className="bg-[#0077b6] transition-all duration-200 hover:bg-[#005f8d]"
              >
                Aria Factbot
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 overflow-hidden rounded-[28px] border border-[#0077b6]/20 bg-white/80 p-6 shadow-[0_18px_55px_rgba(0,119,182,0.12)] backdrop-blur dark:bg-slate-950/50"
        >
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#0077b6]/20 bg-[#0077b6]/10 px-3 py-1 text-sm font-medium text-[#0077b6]">
                <Sparkles className="h-4 w-4" />
                Live misinformation detection and evidence-backed verification
              </div>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                Production-ready fact checking for viral claims, breaking news, and public trust.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Vachan now combines live claim verification, a public analytics dashboard, persistent Supabase logging,
                confidence scoring, and multilingual source-backed analysis in one workflow.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="bg-[#0077b6] hover:bg-[#005f8d]" onClick={() => router.push("/dashboard")}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Open Live Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="border-[#0077b6]/30 hover:border-[#0077b6]/60"
                  onClick={() => router.push("/chat")}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verify a Claim
                </Button>
                <Button
                  variant="outline"
                  className="border-[#0077b6]/30 hover:border-[#0077b6]/60"
                  onClick={refreshNews}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Coverage
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#0077b6]/20 bg-[#0077b6]/5 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077b6] text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Persistent claim logging</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every successful verification is stored in Supabase for public analytics and export.
                </p>
              </div>
              <div className="rounded-2xl border border-[#0077b6]/20 bg-[#0077b6]/5 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077b6] text-white">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Live public dashboard</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Verdict mix, 30-day trends, top languages, and recent claims refresh every 60 seconds.
                </p>
              </div>
              <div className="rounded-2xl border border-[#0077b6]/20 bg-[#0077b6]/5 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077b6] text-white">
                  <Languages className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Multilingual evidence</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Language detection, source-backed verdicts, and readable confidence scoring in one card.
                </p>
              </div>
              <div className="rounded-2xl border border-[#0077b6]/20 bg-[#0077b6]/5 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077b6] text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Public API ready</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  External clients can hit `/api/verify` with rate limiting and structured JSON responses.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="mb-8 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-[#0077b6]/14 bg-white/78 p-6 shadow-[0_16px_50px_rgba(0,119,182,0.08)] backdrop-blur dark:bg-slate-950/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0077b6]">Editorial feed</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">
                  Today&apos;s verification desk
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  High-signal claims, current coverage, and evidence-first review surfaces designed to feel like a
                  live newsroom instead of a generic content list.
                </p>
              </div>
              <div className="rounded-2xl bg-[#0077b6] p-3 text-white shadow-[0_12px_28px_rgba(0,119,182,0.25)]">
                <Newspaper className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3">
            <div className="rounded-[24px] border border-[#0077b6]/14 bg-white/78 p-4 backdrop-blur dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Coverage</p>
              <p className="mt-2 text-2xl font-bold tracking-tight">6 feeds</p>
              <p className="mt-1 text-sm text-muted-foreground">Signal, latest, verified, false, India, world</p>
            </div>
            <div className="rounded-[24px] border border-[#0077b6]/14 bg-white/78 p-4 backdrop-blur dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workflow</p>
              <p className="mt-2 text-2xl font-bold tracking-tight">1-click verify</p>
              <p className="mt-1 text-sm text-muted-foreground">Confidence, citations, and persistent logging</p>
            </div>
            <div className="rounded-[24px] border border-[#0077b6]/14 bg-white/78 p-4 backdrop-blur dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ops view</p>
              <p className="mt-2 text-2xl font-bold tracking-tight">Live</p>
              <p className="mt-1 text-sm text-muted-foreground">Dashboard refreshes every 60 seconds</p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <QuickVerifyPanel />

          <div className="rounded-[30px] border border-[#0077b6]/14 bg-white/78 p-6 shadow-[0_18px_58px_rgba(0,119,182,0.08)] backdrop-blur dark:bg-slate-950/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0077b6]">Why it matters</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">
                  Useful before it feels beautiful.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                  The public shouldn’t have to guess what to do here. This surface now gives them three concrete paths:
                  verify a claim instantly, inspect the live dashboard, or scan the day’s current misinformation feed.
                </p>
              </div>
              <div className="rounded-2xl bg-[#0077b6]/10 p-3 text-[#0077b6]">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] border border-[#0077b6]/10 bg-[#0077b6]/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Public outcome</p>
                <p className="mt-2 text-lg font-semibold">Fast verdicts</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Users can paste a claim and get a verdict, confidence score, and sources without signing in.
                </p>
              </div>
              <div className="rounded-[22px] border border-[#0077b6]/10 bg-[#0077b6]/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Public proof</p>
                <p className="mt-2 text-lg font-semibold">Visible evidence</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Dashboard charts and recent claims make the system legible instead of feeling like a black box.
                </p>
              </div>
              <div className="rounded-[22px] border border-[#0077b6]/10 bg-[#0077b6]/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Public trust</p>
                <p className="mt-2 text-lg font-semibold">Source-backed review</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  The feed and claim results now point people toward links and context instead of vague AI-only summaries.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1 md:col-span-2">
            <div className="space-y-6">
              <Tabs defaultValue="trending">
                <div className="mb-6 rounded-[28px] border border-[#0077b6]/14 bg-white/78 p-4 shadow-[0_16px_40px_rgba(0,119,182,0.07)] backdrop-blur dark:bg-slate-950/50">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0077b6]">Feed channels</p>
                      <p className="mt-1 text-sm text-muted-foreground">Switch between claim queues and region-specific coverage.</p>
                    </div>
                    <NewsFilters onFilterChange={handleFilterChange} activeFilters={activeFilters} />
                  </div>

                  <TabsList className="relative h-auto flex-wrap justify-start gap-2 rounded-2xl bg-[#0077b6]/8 p-2">
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0077b6]/6 to-transparent"
                      animate={{
                        x: [0, 100, 0],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                    {feedTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="relative z-10 rounded-xl border border-transparent px-4 py-2 text-sm font-semibold data-[state=active]:border-[#0077b6]/20 data-[state=active]:bg-white data-[state=active]:text-[#0077b6] dark:data-[state=active]:bg-slate-900"
                      >
                        {tab.value === "trending" && (
                          <motion.span
                            className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-70"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          />
                        )}
                        <span>{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <TabsContent value="trending" className="space-y-6 transition-all duration-300 animate-in fade-in-50">
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0077b6]"></div>
                    </div>
                  ) : filterArticles(articles, activeFilters).length > 0 ? (
                    filterArticles(articles, activeFilters).map((article, index) => (
                      <motion.div
                        key={`trending-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <NewsCard article={article} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        No articles match your filters. Try adjusting your criteria.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="latest" className="space-y-6 transition-all duration-300 animate-in fade-in-50">
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0077b6]"></div>
                    </div>
                  ) : (
                    <>
                      {filterArticles(
                        [...articles].sort((a, b) => {
                          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
                          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
                          return dateB - dateA // Sort in descending order (newest first)
                        }),
                        activeFilters,
                      ).length > 0 ? (
                        filterArticles(
                          [...articles].sort((a, b) => {
                            const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
                            const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
                            return dateB - dateA // Sort in descending order (newest first)
                          }),
                          activeFilters,
                        ).map((article, index) => (
                          <motion.div
                            key={`latest-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <NewsCard article={article} />
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-10">
                          <p className="text-muted-foreground">
                            No articles match your filters. Try adjusting your criteria.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="verified" className="space-y-6 transition-all duration-300 animate-in fade-in-50">
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0077b6]"></div>
                    </div>
                  ) : filterArticles(verifiedArticles, activeFilters).length > 0 ? (
                    filterArticles(verifiedArticles, activeFilters).map((article, index) => (
                      <motion.div
                        key={`verified-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <NewsCard article={article} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        No verified articles match your filters. Try adjusting your criteria.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="false" className="space-y-6 transition-all duration-300 animate-in fade-in-50">
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0077b6]"></div>
                    </div>
                  ) : filterArticles(falseArticles, activeFilters).length > 0 ? (
                    filterArticles(falseArticles, activeFilters).map((article, index) => (
                      <motion.div
                        key={`false-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <NewsCard article={article} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        No false information articles match your filters. Try adjusting your criteria.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="indian" className="space-y-6 transition-all duration-300 animate-in fade-in-50">
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0077b6]"></div>
                    </div>
                  ) : filterArticles(indianArticles, activeFilters).length > 0 ? (
                    filterArticles(indianArticles, activeFilters).map((article, index) => (
                      <motion.div
                        key={`indian-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <NewsCard article={article} isApiArticle />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        No Indian news articles match your filters. Try adjusting your criteria.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="world" className="space-y-6 transition-all duration-300 animate-in fade-in-50">
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0077b6]"></div>
                    </div>
                  ) : filterArticles(apiArticles, activeFilters).length > 0 ? (
                    filterArticles(apiArticles, activeFilters).map((article, index) => (
                      <motion.div
                        key={`world-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <NewsCard article={article} isApiArticle />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        No world news articles match your filters. Try adjusting your criteria.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="col-span-1">
            <div className="space-y-6 md:sticky md:top-24">
              <div className="rounded-[28px] border border-[#0077b6]/14 bg-white/78 p-5 shadow-[0_16px_45px_rgba(0,119,182,0.08)] backdrop-blur dark:bg-slate-950/50">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0077b6]">Brand posture</p>
                    <h3 className="mt-1 text-xl font-bold tracking-tight">Vachan Signal Desk</h3>
                  </div>
                  <div className="rounded-2xl bg-[#0077b6]/10 p-3 text-[#0077b6]">
                    <Radar className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="rounded-2xl border border-[#0077b6]/10 bg-[#0077b6]/5 p-3">
                    Reframed as a live verification product with clearer evidence surfaces and sharper editorial pacing.
                  </div>
                  <Link href="/dashboard" className="flex items-center justify-between rounded-2xl border border-[#0077b6]/10 p-3 text-slate-900 transition hover:border-[#0077b6]/30 dark:text-white">
                    <span>Open public analytics</span>
                    <ArrowUpRight className="h-4 w-4 text-[#0077b6]" />
                  </Link>
                </div>
              </div>
              <CommunitiesSection />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2026 Vachan. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a
                href="/privacy"
                className="text-muted-foreground hover:text-[#0077b6] transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-muted-foreground hover:text-[#0077b6] transition-colors duration-200 text-sm"
              >
                Terms of Service
              </a>
              <a
                href="/contact"
                className="text-muted-foreground hover:text-[#0077b6] transition-colors duration-200 text-sm"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>About Vachan</p>
            <p className="mt-1">
              Vachan is a cutting-edge fact-checking platform designed to combat misinformation in the digital age.
              Vachan - A promise to Morality
            </p>
          </div>
        </div>
      </footer>

      <ReadabilitySettings open={readabilityOpen} onOpenChange={setReadabilityOpen} />
      <EnhancedChatbot />
    </div>
  )
}
