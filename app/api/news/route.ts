import { NextResponse } from "next/server"

// This is a server-side API route that will proxy requests to MediaStack
// This avoids CORS issues that happen when calling the API directly from the browser
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get("country") || ""

  try {
    // Use your MediaStack API key
    const API_KEY = "f5d27a8827bfd03350c76badee092864"

    // Build the API URL based on parameters
    let apiUrl = `http://api.mediastack.com/v1/news?access_key=${API_KEY}&languages=en&limit=10`

    // Add country filter if specified
    if (country) {
      apiUrl += `&countries=${country}`
    }

    // Make the server-side request to MediaStack
    const response = await fetch(apiUrl)
    const data = await response.json()

    // Return the data to the client
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from MediaStack:", error)
    return NextResponse.json({ error: "Failed to fetch news data" }, { status: 500 })
  }
}

