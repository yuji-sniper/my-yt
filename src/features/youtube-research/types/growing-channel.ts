export type GrowingChannel = {
  channelId: string
  title: string
  description: string
  thumbnailUrl: string
  customUrl?: string
  subscriberCount: number
  viewCount: number
  videoCount: number
  publishedAt: string
  daysSinceCreation: number
  growthSpeed: number | null
}

export type SearchGrowingChannelsParams = {
  keyword?: string
  publishedAfter: string
  publishedBefore?: string
  regionCode?: string
  relevanceLanguage?: string
  subscriberCountMin?: number
  subscriberCountMax?: number
  pageToken?: string
}

export type ChannelSortKey = "growthSpeed" | "subscriberCount" | "viewCount"

export type SearchGrowingChannelsResponse = {
  items: GrowingChannel[]
  nextPageToken?: string
  totalResults: number
  quotaUsed: number
}
