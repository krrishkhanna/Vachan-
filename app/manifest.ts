import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vachan - News Fact-Checker",
    short_name: "Vachan",
    description: "Verify trending news and social media content with fact-checking and translation features",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0077b6",
    icons: [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design-VErbKCUx4KCsynNSG9M8twRpDqvq2Z.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design-VErbKCUx4KCsynNSG9M8twRpDqvq2Z.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}

