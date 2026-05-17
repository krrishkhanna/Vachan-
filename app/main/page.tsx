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
import { MoonIcon, SunIcon, Globe, RefreshCw } from "lucide-react"
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

// Cursor tracking component for main page
const MainPageCursorEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className={`absolute rounded-full blur-3xl ${resolvedTheme === "dark" ? "bg-[#0077b6]/10" : "bg-[#0077b6]/20"}`}
        style={{
          width: 150,
          height: 150,
          left: mousePosition.x - 75,
          top: mousePosition.y - 75,
          transition: "left 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      />
    </div>
  )
}

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
  const fetchWorldNews = useCallback(async () => {
    setIsLoading(true)
    try {
      const newsData = await fetchNewsFromAPI()
      setApiArticles(newsData)

      // Show success toast
      toast({
        title: "News Updated",
        description: "Latest world news has been loaded successfully.",
      })
    } catch (error) {
      console.error("Error fetching world news:", error)
      toast({
        title: "Error Loading News",
        description: "Failed to load world news. Using fallback data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Update the fetchIndianNews function to use MediaStack API
  const fetchIndianNews = useCallback(async () => {
    setIsLoading(true)
    try {
      const newsData = await fetchIndianNewsFromAPI()
      setIndianArticles(newsData)

      // Show success toast
      toast({
        title: "Indian News Updated",
        description: "Latest Indian news has been loaded successfully.",
      })
    } catch (error) {
      console.error("Error fetching Indian news:", error)
      toast({
        title: "Error Loading News",
        description: "Failed to load Indian news. Using fallback data.",
        variant: "destructive",
      })
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
    fetchWorldNews()
    fetchIndianNews()
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
      <MainPageCursorEffect />

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
                className="transition-all duration-200 hover:bg-background/10 hover:shadow-sm border-[#0077b6]/30 hover:border-[#0077b6]/60"
              >
                <RefreshCw className="mr-1 h-4 w-4" />
                Refresh News
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
                className="transition-all duration-200 hover:bg-background/10 hover:shadow-sm border-[#0077b6]/30 hover:border-[#0077b6]/60"
              >
                Readability
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={openTranslationExtension}
                className="transition-all duration-200 hover:bg-background/10 hover:shadow-sm border-[#0077b6]/30 hover:border-[#0077b6]/60"
              >
                <Globe className="mr-1 h-4 w-4" /> Translate
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/chat")}
                className="transition-all duration-200 hover:bg-background/10 hover:shadow-sm border-[#0077b6]/30 hover:border-[#0077b6]/60"
              >
                Aria Factbot
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1 md:col-span-2">
            <div className="space-y-6">
              <Tabs defaultValue="trending">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                  <TabsList className="bg-[#0077b6]/10 p-1 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#0077b6]/5 to-transparent"
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
                    {["trending", "latest", "verified", "false", "indian", "world"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="data-[state=active]:bg-[#0077b6] data-[state=active]:text-white transition-all duration-200 relative group z-10"
                      >
                        {tab === "trending" && (
                          <motion.span
                            className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-70"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          />
                        )}
                        <span className="capitalize">{tab}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <NewsFilters onFilterChange={handleFilterChange} activeFilters={activeFilters} />
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
            <div className="space-y-6">
              <CommunitiesSection />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2025 Vachan. All rights reserved.</p>
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

