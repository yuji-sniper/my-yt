import type {
  ChannelAgeFilterKey,
  ChannelAgeRange
} from "../types/trending-video"

function getChannelAgeDays(channelPublishedAt: string): number | null {
  if (!channelPublishedAt) return null

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const published = new Date(channelPublishedAt)
  const diffMs = now.getTime() - published.getTime()

  return diffMs / (1000 * 60 * 60 * 24)
}

export function getChannelAgeRange(
  channelPublishedAt: string
): ChannelAgeRange {
  const diffDays = getChannelAgeDays(channelPublishedAt)
  if (diffDays === null) return null

  if (diffDays <= 30) return "within1Month"
  if (diffDays <= 90) return "within3Months"
  if (diffDays <= 180) return "within6Months"
  if (diffDays <= 365) return "within1Year"

  return null
}

const CHANNEL_AGE_THRESHOLD_DAYS: Record<
  Exclude<ChannelAgeFilterKey, "all">,
  number
> = {
  within1Month: 30,
  within3Months: 90,
  within6Months: 180,
  within1Year: 365
}

export function isWithinChannelAge(
  channelPublishedAt: string,
  filterKey: ChannelAgeFilterKey
): boolean {
  if (filterKey === "all") return true

  const diffDays = getChannelAgeDays(channelPublishedAt)
  if (diffDays === null) return false

  return diffDays <= CHANNEL_AGE_THRESHOLD_DAYS[filterKey]
}
