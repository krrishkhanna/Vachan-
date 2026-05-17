"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface FactCheckData {
  category: string
  count: number
}

export function FactCheckStats() {
  const factCheckData: FactCheckData[] = [
    { category: "Politics", count: 245 },
    { category: "Health", count: 187 },
    { category: "Science", count: 124 },
    { category: "Finance", count: 98 },
    { category: "Technology", count: 156 },
    { category: "Entertainment", count: 76 },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Fact Check Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer
            config={{
              count: {
                label: "Fact Checks",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factCheckData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-green-50 p-2 rounded-md text-center">
            <p className="text-sm text-green-700">Total Fact Checks</p>
            <p className="font-bold text-green-800">886</p>
          </div>
          <div className="bg-blue-50 p-2 rounded-md text-center">
            <p className="text-sm text-blue-700">This Month</p>
            <p className="font-bold text-blue-800">124</p>
          </div>
          <div className="bg-purple-50 p-2 rounded-md text-center">
            <p className="text-sm text-purple-700">Accuracy Rate</p>
            <p className="font-bold text-purple-800">94.2%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

