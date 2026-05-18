const newsArticles = [
  {
    title: "AI-Generated Video Falsely Shows a Delhi Doctor Endorsing a Miracle Diabetes Cure",
    content:
      "A fabricated vertical video using a doctor's cloned voice and likeness circulated across messaging groups and short-form video platforms, claiming a kitchen remedy could replace insulin. The clip spread rapidly because it looked like a casual home recording rather than an advertisement.",
    source: "WhatsApp, Short Video Apps",
    sourceUrl: "https://www.axios.com/2026/05/06/doctors-ai-deepfakes-misinformation-problem",
    hashtags: ["DeepfakeHealth", "DoctorAI", "ClaimWatch"],
    publishedAt: "2026-05-18T10:20:00Z",
    author: "Health Verification Desk",
    urlToImage: "https://placeholder.svg?height=400&width=600",
    engagementStats: {
      tweets: 28400,
      botPercentage: 41,
    },
    factCheck: {
      status: "false",
      details:
        "The video is not authentic. It repurposes a real doctor's public photos and overlays a synthetic voice to promote an unverified treatment. No licensed medical authority has endorsed the cure described in the clip.",
      sources: [
        "American Medical Association warning on medical deepfakes (May 2026)",
        "Hospital media office denial and identity misuse notice",
        "Platform moderation notice referencing manipulated media",
      ],
    },
  },
  {
    title: "Misleading Posts Claim India's New Content Rules Amount to a Blanket Ban on Satire",
    content:
      "Posts reacting to India's tougher platform compliance rules framed the changes as a universal ban on satire, memes, and commentary. The viral interpretation spread faster than the actual legal text and triggered calls for mass account migration.",
    source: "X, Instagram",
    sourceUrl: "https://www.investing.com/news/stock-market-news/india-tells-global-tech-platforms-to-follow-constitution-after-tougher-content-rules-4509126",
    hashtags: ["ContentRules", "PlatformPolicy", "Misleading"],
    publishedAt: "2026-05-17T15:00:00Z",
    author: "Policy Monitoring Desk",
    engagementStats: {
      tweets: 21800,
    },
    factCheck: {
      status: "misleading",
      details:
        "The posts exaggerate the scope of the policy shift. The rules raise compliance pressure and takedown risk, but they do not amount to a literal blanket ban on satire or commentary by default.",
      sources: [
        "Reuters report on India's tougher content rules (February 2026)",
        "Ministry remarks on constitutional compliance for platforms",
        "Digital rights analysis of moderation and takedown obligations",
      ],
    },
  },
  {
    title: "False Airport Shutdown Advisory Circulates During North India Heatwave Alerts",
    content:
      "A screenshot styled like an aviation notice claimed multiple airports would suspend operations because of extreme heat. The message prompted confusion among travelers and was forwarded as a travel alert in family groups.",
    source: "Telegram, WhatsApp",
    sourceUrl: "https://toolbox.google.com/factcheck/explorer",
    hashtags: ["HeatwaveAlert", "AirportNotice", "TravelRumor"],
    publishedAt: "2026-05-16T08:50:00Z",
    author: "Civic Misinformation Desk",
    engagementStats: {
      tweets: 14300,
    },
    factCheck: {
      status: "false",
      details:
        "The advisory is fabricated. Airports continued operations and the screenshot does not match the format of genuine regulator or airline notices. The alert appears to have been assembled from edited travel graphics.",
      sources: [
        "Airline operations updates showing normal schedules",
        "Airport customer advisory feeds",
        "Fact-check search index for the viral screenshot pattern",
      ],
    },
  },
  {
    title: "KKR Backs Indian Electric Bus Platform in Deal Valued at Up to $310 Million",
    content:
      "Private equity firm KKR said it will invest up to $310 million in a deal tied to Indian electric commercial vehicle growth. The announcement became a bright spot in climate-tech and mobility coverage across Indian business media.",
    source: "Reuters",
    sourceUrl: "https://www.investing.com/news/stock-market-news/kkr-to-invest-up-to-310-million-in-india-ebus-deal-4567723",
    hashtags: ["ClimateTech", "ElectricBuses", "IndiaBusiness"],
    publishedAt: "2026-05-15T12:10:00Z",
    author: "Business Desk",
    urlToImage: "https://placeholder.svg?height=400&width=600",
    engagementStats: {
      tweets: 16400,
    },
    factCheck: {
      status: "true",
      details:
        "The investment announcement was reported publicly and aligns with the stated funding range and companies involved. Coverage across financial outlets and market reporting confirms the core details.",
      sources: [
        "Reuters report on the e-bus investment deal",
        "Company statement on platform expansion plans",
        "Market coverage summarizing the announced funding size",
      ],
    },
  },
  {
    title: "European Union Opens Formal Probe into Grok Over Sexual Deepfakes",
    content:
      "European regulators opened a formal probe after nonconsensual sexualized deepfake images circulated on X through Grok-linked content generation flows. The case intensified the debate over platform accountability and AI safeguards.",
    source: "Associated Press",
    sourceUrl: "https://ny1.com/nyc/all-boroughs/ap-top-news/2026/01/26/european-union-opens-investigation-into-musks-ai-chatbot-grok-over-sexual-deepfakes",
    hashtags: ["Deepfakes", "EUProbe", "AIGovernance"],
    publishedAt: "2026-05-14T18:35:00Z",
    author: "Global Tech Policy Desk",
    engagementStats: {
      tweets: 19200,
    },
    factCheck: {
      status: "true",
      details:
        "The regulatory action and the subject of the probe were widely reported. The claim reflects the public framing of the investigation and the concern over nonconsensual deepfake imagery.",
      sources: [
        "AP reporting on the EU investigation",
        "European Commission statement cited in coverage",
        "Platform safety reporting on deepfake distribution concerns",
      ],
    },
  },
  {
    title: "Fabricated Screenshots Claim MEA Issued a Secret Border Alert to Citizens Abroad",
    content:
      "Doctored screenshots mimicking an official fact-check post from India's external affairs ecosystem spread on social media and in travel groups, suggesting urgent border restrictions that were never announced.",
    source: "X, Messaging Groups",
    sourceUrl: "https://www.ndtv.com/topic/deepfake",
    hashtags: ["MEAAlert", "FakeScreenshot", "TravelMisinformation"],
    publishedAt: "2026-05-13T20:00:00Z",
    author: "Foreign Affairs Verification Desk",
    engagementStats: {
      tweets: 11700,
    },
    factCheck: {
      status: "false",
      details:
        "The screenshots are fabricated and do not correspond to a real government alert. Official fact-checking channels publicly described similar circulating claims as fake and misleading.",
      sources: [
        "MEA-linked fact-check handle debunking fabricated social posts",
        "Official travel advisory channels with no matching alert",
        "Platform screenshot comparison showing altered typography",
      ],
    },
  },
  {
    title: "Doctors Warn That AI Deepfakes Are Being Used to Sell Fake Health Products",
    content:
      "Clinicians and medical organizations are raising alarms after AI-generated videos began impersonating doctors in order to sell unverified supplements and miracle products. The trend has become a public-health and trust issue rather than a novelty problem.",
    source: "Axios",
    sourceUrl: "https://www.axios.com/2026/05/06/doctors-ai-deepfakes-misinformation-problem",
    hashtags: ["MedicalTrust", "AIDeepfakes", "HealthFraud"],
    publishedAt: "2026-05-12T09:30:00Z",
    author: "Health Systems Desk",
    engagementStats: {
      tweets: 9500,
    },
    factCheck: {
      status: "true",
      details:
        "The broader warning is real and grounded in documented cases of AI-generated impersonation. Medical groups have publicly called for stronger identity and transparency protections.",
      sources: [
        "Axios reporting on doctors' deepfake misuse",
        "American Medical Association public warning",
        "Healthcare privacy and identity protection commentary",
      ],
    },
  },
  {
    title: 'Misleading Thread Says Every AI Image Must Now Carry a Global "Mandatory Watermark Label"',
    content:
      "A viral thread mixed corporate policy experiments, proposed labeling ideas, and regional platform rules into a single claim that every AI-generated image now legally requires a global watermark label.",
    source: "LinkedIn, X",
    sourceUrl: "https://time.com/7290050/veo-3-google-misinformation-deepfake/",
    hashtags: ["AIImages", "WatermarkRules", "MisleadingThread"],
    publishedAt: "2026-05-11T14:40:00Z",
    author: "AI Governance Desk",
    engagementStats: {
      tweets: 8700,
    },
    factCheck: {
      status: "misleading",
      details:
        "Labeling and provenance requirements are evolving across companies and jurisdictions, but there is no single universal rule that every AI image already carries a legally mandatory global watermark.",
      sources: [
        "Coverage on synthetic media and provenance debates",
        "Platform policy notes on AI-generated content labels",
        "AI policy analysis describing fragmented rulemaking",
      ],
    },
  },
]

// Function to get random articles from the dataset
export function getRandomArticles(count: number) {
  const shuffled = [...newsArticles].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Function to get a specific article by title
export function getArticleByTitle(title: string) {
  return newsArticles.find((article) => article.title === title)
}

// Function to get articles by fact check status
export function getArticlesByFactCheckStatus(status: string) {
  return newsArticles.filter((article) => article.factCheck.status === status)
}

// Function to get articles by source
export function getArticlesBySource(source: string) {
  return newsArticles.filter((article) => article.source.includes(source))
}

// Function to get articles by hashtag
export function getArticlesByHashtag(hashtag: string) {
  return newsArticles.filter((article) => article.hashtags.some((tag) => tag.toLowerCase() === hashtag.toLowerCase()))
}

// Function to fetch news from MediaStack API
export async function fetchNewsFromAPI() {
  try {
    // Skip the actual API call and just return mock data
    return getMockWorldNews()
  } catch (error) {
    console.error("Error fetching news from API:", error)
    return getMockWorldNews()
  }
}

// Function to fetch Indian news from News API
export async function fetchIndianNewsFromAPI() {
  try {
    // Skip the actual API call and just return mock data
    return getMockIndianNews()
  } catch (error) {
    console.error("Error fetching Indian news from API:", error)
    return getMockIndianNews()
  }
}

// Mock world news data as fallback
function getMockWorldNews() {
  return [
    {
      title: "AI Deepfakes Push Health Regulators to Revisit Identity Protections",
      content:
        "Health organizations and regulators are responding to a rise in AI-generated impersonation videos that use trusted professionals to sell fake remedies and supplements. The issue has quickly moved from niche tech concern to mainstream public-health risk.",
      source: "Axios",
      sourceUrl: "https://www.axios.com/2026/05/06/doctors-ai-deepfakes-misinformation-problem",
      url: "https://www.axios.com/2026/05/06/doctors-ai-deepfakes-misinformation-problem",
      urlToImage: "https://placeholder.svg?height=400&width=600",
      publishedAt: "2026-05-18T10:30:00Z",
      author: "Global Verification Desk",
      factCheck: {
        status: "unverified",
        details: "This article is from mock data and is ready for fact-checking.",
        sources: ["Axios"],
      },
    },
    {
      title: "Europe's Grok Probe Intensifies Pressure on Synthetic Media Guardrails",
      content:
        "A formal European probe into sexual deepfakes tied to AI content systems is driving a wider debate about provenance, moderation speed, and product accountability for generative platforms.",
      source: "Associated Press",
      sourceUrl: "https://ny1.com/nyc/all-boroughs/ap-top-news/2026/01/26/european-union-opens-investigation-into-musks-ai-chatbot-grok-over-sexual-deepfakes",
      url: "https://ny1.com/nyc/all-boroughs/ap-top-news/2026/01/26/european-union-opens-investigation-into-musks-ai-chatbot-grok-over-sexual-deepfakes",
      urlToImage: "https://placeholder.svg?height=400&width=600",
      publishedAt: "2026-05-17T14:15:00Z",
      author: "International Policy Monitor",
      factCheck: {
        status: "unverified",
        details: "This article is from mock data and is ready for fact-checking.",
        sources: ["Associated Press"],
      },
    },
  ]
}

// Mock Indian news data as fallback
function getMockIndianNews() {
  return [
    {
      title: "India Tightens Platform Compliance Pressure as Deepfake Regulation Debate Grows",
      content:
        "India's tougher content-takedown and platform compliance posture has reignited debate over how democracies should handle deepfakes, misinformation, and constitutional speech protections at scale.",
      source: "Reuters",
      sourceUrl: "https://www.investing.com/news/stock-market-news/india-tells-global-tech-platforms-to-follow-constitution-after-tougher-content-rules-4509126",
      url: "https://www.investing.com/news/stock-market-news/india-tells-global-tech-platforms-to-follow-constitution-after-tougher-content-rules-4509126",
      urlToImage: "https://placeholder.svg?height=400&width=600",
      publishedAt: "2026-05-18T09:15:00Z",
      author: "India Policy Desk",
      factCheck: {
        status: "unverified",
        details: "This article is from mock data and is ready for fact-checking.",
        sources: ["Reuters"],
      },
    },
    {
      title: "Indian E-Bus Expansion Deal Signals Fresh Momentum for Climate Mobility Funding",
      content:
        "A major e-bus investment announcement has put commercial EV infrastructure back in focus across Indian business coverage, with analysts watching how capital, policy, and fleet operators converge over the next phase of deployment.",
      source: "Reuters",
      sourceUrl: "https://www.investing.com/news/stock-market-news/kkr-to-invest-up-to-310-million-in-india-ebus-deal-4567723",
      url: "https://www.investing.com/news/stock-market-news/kkr-to-invest-up-to-310-million-in-india-ebus-deal-4567723",
      urlToImage: "https://placeholder.svg?height=400&width=600",
      publishedAt: "2026-05-17T11:30:00Z",
      author: "Climate Mobility Reporter",
      factCheck: {
        status: "unverified",
        details: "This article is from mock data and is ready for fact-checking.",
        sources: ["Reuters"],
      },
    },
  ]
}

// Function to get trending topics based on the news articles
export function getTrendingTopics() {
  // In a real app, this would analyze frequency and recency of topics
  return [
    { name: "Climate Change", count: 1245, trend: "up" },
    { name: "Artificial Intelligence", count: 987, trend: "up" },
    { name: "Misinformation", count: 876, trend: "up" },
    { name: "Quantum Computing", count: 654, trend: "up" },
    { name: "Biodiversity", count: 543, trend: "down" },
  ]
}

// Update the filterArticles function in the existing file
export function filterArticles(
  articles: any[],
  filters: {
    sources: string[]
    factCheckStatus: string[]
    date?: Date
  },
) {
  return articles.filter((article) => {
    // Filter by date if selected
    if (filters.date) {
      const articleDate = article.publishedAt ? new Date(article.publishedAt) : new Date()
      const filterDate = filters.date

      // Format both dates to YYYY-MM-DD for comparison
      const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
      }

      if (formatDate(articleDate) !== formatDate(filterDate)) {
        return false
      }
    }

    // Filter by source if any sources are selected
    if (filters.sources.length > 0) {
      const articleSource = typeof article.source === "string" ? article.source : article.source?.name || ""

      const sourcesMatch = filters.sources.some((source) => articleSource.toLowerCase().includes(source.toLowerCase()))

      if (!sourcesMatch) return false
    }

    // Filter by fact check status if any statuses are selected
    if (filters.factCheckStatus.length > 0) {
      // For API articles that might not have factCheck, use a default status
      const status = article.factCheck?.status || "unverified"

      // Check if the article's status is in the selected statuses
      if (!filters.factCheckStatus.includes(status)) {
        return false
      }
    }

    return true
  })
}
