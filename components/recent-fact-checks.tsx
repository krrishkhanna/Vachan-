"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, HelpCircle } from "lucide-react"

interface FactCheck {
  id: string
  claim: string
  source: string
  date: string
  status: "true" | "false" | "partially-true" | "unverified"
}

export function RecentFactChecks() {
  const [factChecks, setFactChecks] = useState<FactCheck[]>([
    {
      id: "1",
      claim: "India's COVID-19 vaccination drive is the world's largest",
      source: "Ministry of Health",
      date: "2023-12-15",
      status: "true",
    },
    {
      id: "2",
      claim: "Drinking hot water with lemon cures COVID-19",
      source: "Social Media",
      date: "2023-12-10",
      status: "false",
    },
    {
      id: "3",
      claim: "New Delhi is implementing a complete ban on petrol vehicles by 2025",
      source: "News Report",
      date: "2023-12-05",
      status: "partially-true",
    },
    {
      id: "4",
      claim: "Indian economy will grow at 8.5% in 2024",
      source: "Economic Times",
      date: "2023-12-01",
      status: "unverified",
    },
    {
      id: "5",
      claim: "Ayurvedic herbs boost immunity against all viral infections",
      source: "Health Magazine",
      date: "2023-11-28",
      status: "partially-true",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "true":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "false":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "partially-true":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "unverified":
        return <HelpCircle className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "true":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">True</Badge>
      case "false":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">False</Badge>
      case "partially-true":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Partially True</Badge>
      case "unverified":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Unverified</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Recent Fact Checks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {factChecks.map((check) => (
            <div key={check.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getStatusIcon(check.status)}</div>
                <div className="flex-1">
                  <p className="font-medium">{check.claim}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                    <span>Source: {check.source}</span>
                    <span>•</span>
                    <span>
                      {new Date(check.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <div className="ml-auto">{getStatusBadge(check.status)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="text-primary hover:underline font-medium">View All Fact Checks</button>
        </div>
      </CardContent>
    </Card>
  )
}

