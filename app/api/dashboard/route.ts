import { NextResponse } from "next/server"
import { getDashboardStats } from "@/lib/dashboard-stats"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const stats = await getDashboardStats()
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Error loading dashboard stats:", error)
    return NextResponse.json(
      {
        error: "Failed to load dashboard stats",
      },
      { status: 500 },
    )
  }
}
