import type { ChannelAgeRange } from "../types/trending-video"

export function getChannelAgeRange(
  channelPublishedAt: string
): ChannelAgeRange {
  if (!channelPublishedAt) return null

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const published = new Date(channelPublishedAt)
  const diffMs = now.getTime() - published.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffDays <= 30) return "within1Month"
  if (diffDays <= 90) return "within3Months"
  if (diffDays <= 180) return "within6Months"
  if (diffDays <= 365) return "within1Year"

  return null
}
