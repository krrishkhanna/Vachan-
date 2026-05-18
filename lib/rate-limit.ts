import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const REQUEST_LIMIT = 10
const WINDOW = "1 m"

let ratelimitInstance: Ratelimit | null = null
let loggedMissingConfig = false

function getRatelimit() {
  if (ratelimitInstance) {
    return ratelimitInstance
  }

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    if (!loggedMissingConfig) {
      loggedMissingConfig = true
      console.warn("Upstash rate limiting is disabled because Redis environment variables are missing.")
    }

    return null
  }

  ratelimitInstance = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.fixedWindow(REQUEST_LIMIT, WINDOW),
    analytics: true,
    prefix: "vachan:verify",
  })

  return ratelimitInstance
}

export async function rateLimitByIp(ipAddress: string) {
  const ratelimit = getRatelimit()

  if (!ratelimit) {
    return {
      success: true,
      retryAfterSeconds: 0,
      remaining: REQUEST_LIMIT,
    }
  }

  const result = await ratelimit.limit(ipAddress || "unknown")

  return {
    success: result.success,
    retryAfterSeconds: result.success ? 0 : Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    remaining: result.remaining,
  }
}
