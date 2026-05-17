"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface MisinformationHotspot {
  id: number
  location: string
  count: number
  lat: number
  lng: number
}

export function MisinformationMap() {
  const [hotspots, setHotspots] = useState<MisinformationHotspot[]>([
    { id: 1, location: "New Delhi", count: 156, lat: 28.6139, lng: 77.209 },
    { id: 2, location: "Mumbai", count: 124, lat: 19.076, lng: 72.8777 },
    { id: 3, location: "Bangalore", count: 98, lat: 12.9716, lng: 77.5946 },
    { id: 4, location: "Chennai", count: 87, lat: 13.0827, lng: 80.2707 },
    { id: 5, location: "Kolkata", count: 76, lat: 22.5726, lng: 88.3639 },
  ])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Misinformation Hotspots</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] w-full bg-gray-100 rounded-md overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center opacity-50"></div>

          {/* Map pins */}
          {hotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              className="absolute flex flex-col items-center"
              style={{
                left: `${((hotspot.lng + 180) / 360) * 100}%`,
                top: `${((90 - hotspot.lat) / 180) * 100}%`,
              }}
            >
              <div className="relative group">
                <MapPin className="h-6 w-6 text-red-500 cursor-pointer" fill="rgba(239, 68, 68, 0.2)" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-white p-2 rounded shadow-lg text-sm z-10 whitespace-nowrap">
                  <p className="font-bold">{hotspot.location}</p>
                  <p>{hotspot.count} misinformation cases</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 p-3 rounded-md">
            <h3 className="font-semibold text-red-800">Top Hotspot</h3>
            <p className="text-red-700">New Delhi with 156 cases</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-md">
            <h3 className="font-semibold text-blue-800">Total Tracked</h3>
            <p className="text-blue-700">541 misinformation cases</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

