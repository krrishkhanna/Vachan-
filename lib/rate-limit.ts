const WINDOW_MS = 60_000
const REQUEST_LIMIT = 10

const requestStore = new Map<string, number[]>()

export function rateLimitByIp(ipAddress: string) {
  const now = Date.now()
  const recentRequests = (requestStore.get(ipAddress) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS)

  if (recentRequests.length >= REQUEST_LIMIT) {
    requestStore.set(ipAddress, recentRequests)

    const oldestRequest = recentRequests[0]
    const retryAfterSeconds = Math.max(1, Math.ceil((WINDOW_MS - (now - oldestRequest)) / 1000))

    return {
      success: false,
      retryAfterSeconds,
      remaining: 0,
    }
  }

  recentRequests.push(now)
  requestStore.set(ipAddress, recentRequests)

  return {
    success: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, REQUEST_LIMIT - recentRequests.length),
  }
}
