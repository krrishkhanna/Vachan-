"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { BarChart3, Globe2, MoonIcon, Radar, ShieldCheck, Sparkles, SunIcon, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VachanLogo } from "@/components/vachan-logo"

const momentumData = [
  { day: "May 13", verified: 34, false: 19, misleading: 12 },
  { day: "May 14", verified: 48, false: 22, misleading: 16 },
  { day: "May 15", verified: 51, false: 26, misleading: 13 },
  { day: "May 16", verified: 63, false: 28, misleading: 17 },
  { day: "May 17", verified: 58, false: 24, misleading: 14 },
  { day: "May 18", verified: 72, false: 31, misleading: 19 },
  { day: "Today", verified: 67, false: 27, misleading: 18 },
]

const launchCards = [
  {
    title: "Claims logging",
    body: "Every successful verification is persisted to Supabase for analytics, exports, and auditability.",
    icon: ShieldCheck,
  },
  {
    title: "Live dashboard",
    body: "Public charts, recent claims, verdict mix, and language trends refresh every 60 seconds.",
    icon: BarChart3,
  },
  {
    title: "Source-backed verdicts",
    body: "Confidence scoring and citation links make each verdict readable, traceable, and shareable.",
    icon: Globe2,
  },
]

const proofPoints = [
  { label: "Public verify API", value: "POST /api/verify" },
  { label: "Rate limiting", value: "10 requests / IP / min" },
  { label: "CSV export", value: "500 latest claims" },
  { label: "Detected languages", value: "Top 5 on dashboard" },
]

export default function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      className={`min-h-screen ${
        resolvedTheme === "dark"
          ? "bg-[radial-gradient(circle_at_top_left,_rgba(0,119,182,0.18),_transparent_28%),linear-gradient(180deg,#06131d_0%,#091d2d_100%)]"
          : "bg-[radial-gradient(circle_at_top_left,_rgba(0,119,182,0.14),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#edf7ff_100%)]"
      }`}
    >
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <VachanLogo />
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="border-[#0077b6]/25 hover:border-[#0077b6]/60">
                Dashboard
              </Button>
            </Link>
            <Link href="/main">
              <Button className="bg-[#0077b6] hover:bg-[#005f8d]">Open App</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-20 pt-8">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#0077b6]/20 bg-[#0077b6]/8 px-3 py-1 text-sm font-medium text-[#0077b6]">
              <Sparkles className="h-4 w-4" />
              Built for live misinformation response, not a static classroom demo
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-[-0.05em] text-slate-950 dark:text-white md:text-7xl">
              A sharper Vachan for live claims, source trails, and public trust.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Verify breaking claims, inspect evidence, log every result, and publish a live analytics layer that
              anyone can trust. The new release is faster, clearer, and much more product-ready.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/main">
                <Button size="lg" className="bg-[#0077b6] px-6 hover:bg-[#005f8d]">
                  Verify News Now
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-[#0077b6]/25 px-6 hover:border-[#0077b6]/60">
                  View Public Dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {proofPoints.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#0077b6]/15 bg-white/70 p-4 shadow-[0_14px_40px_rgba(0,119,182,0.08)] backdrop-blur dark:bg-slate-950/45"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="rounded-[32px] border border-[#0077b6]/18 bg-white/78 p-5 shadow-[0_22px_65px_rgba(0,119,182,0.14)] backdrop-blur dark:bg-slate-950/55"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0077b6]">Verification momentum</p>
                <h2 className="text-2xl font-bold tracking-tight">Last 7 days</h2>
              </div>
              <div className="rounded-2xl bg-[#0077b6] p-3 text-white">
                <Radar className="h-5 w-5" />
              </div>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={momentumData} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="verifiedFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0077b6" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="#0077b6" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,116,139,0.18)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid rgba(0,119,182,0.18)",
                      boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
                    }}
                  />
                  <Area type="monotone" dataKey="verified" stroke="#0077b6" strokeWidth={3} fill="url(#verifiedFill)" />
                  <Area type="monotone" dataKey="false" stroke="#dc2626" strokeWidth={2.5} fillOpacity={0} />
                  <Area type="monotone" dataKey="misleading" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {launchCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.32, delay: index * 0.08 }}
              >
                <Card className="h-full overflow-hidden border border-[#0077b6]/14 bg-white/78 shadow-[0_14px_38px_rgba(0,119,182,0.08)] backdrop-blur dark:bg-slate-950/50">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0077b6] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{card.body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border border-[#0077b6]/14 bg-[#0077b6] text-white shadow-[0_18px_48px_rgba(0,119,182,0.22)]">
            <CardContent className="p-7">
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">What changed</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">No nostalgia. No stale demo energy.</h2>
              <p className="mt-4 max-w-xl text-white/80">
                The refreshed experience focuses on present-day verification workflows: live inputs, recent claim
                logging, stronger evidence treatment, and a dashboard that feels like a product surface instead of a
                side page.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/main">
                  <Button variant="secondary" className="bg-white text-[#005f8d] hover:bg-white/90">
                    Explore Main Feed
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Open Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-[#0077b6]/14 bg-white/75 p-6 backdrop-blur dark:bg-slate-950/50">
              <div className="mb-4 flex items-center gap-3">
                <Zap className="h-5 w-5 text-[#0077b6]" />
                <p className="font-semibold">Current product posture</p>
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                `/main` now acts like a live operations feed, while `/dashboard` serves as the public proof layer.
              </p>
            </div>
            <div className="rounded-[28px] border border-[#0077b6]/14 bg-white/75 p-6 backdrop-blur dark:bg-slate-950/50">
              <div className="mb-4 flex items-center gap-3">
                <Globe2 className="h-5 w-5 text-[#0077b6]" />
                <p className="font-semibold">Evidence-first output</p>
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                Verdict badges, confidence bars, and source links now carry the weight of the interaction.
              </p>
            </div>
            <div className="rounded-[28px] border border-[#0077b6]/14 bg-white/75 p-6 backdrop-blur dark:bg-slate-950/50">
              <div className="mb-4 flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-[#0077b6]" />
                <p className="font-semibold">Public observability</p>
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                Dashboard charts, recent claims, and CSV export make the system externally legible.
              </p>
            </div>
            <div className="rounded-[28px] border border-[#0077b6]/14 bg-white/75 p-6 backdrop-blur dark:bg-slate-950/50">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#0077b6]" />
                <p className="font-semibold">Ready for deployment</p>
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                The app now expects proper env variables, live Supabase access, and shared rate limiting for production.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto flex flex-col justify-between gap-4 px-4 py-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <VachanLogo />
            <span className="text-sm text-muted-foreground">© 2026 Vachan</span>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            <Link href="/main" className="hover:text-[#0077b6]">
              Main feed
            </Link>
            <Link href="/dashboard" className="hover:text-[#0077b6]">
              Dashboard
            </Link>
            <Link href="/chat" className="hover:text-[#0077b6]">
              Aria Factbot
            </Link>
            <Link href="/contact" className="hover:text-[#0077b6]">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
