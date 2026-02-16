export const CHANNEL_SEARCH_ORDER_VALUES = [
  "relevance",
  "date",
  "rating",
  "title",
  "videoCount",
  "viewCount"
] as const
export type ChannelSearchOrder = (typeof CHANNEL_SEARCH_ORDER_VALUES)[number]

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
  growthSpeed: number
}

export type SearchGrowingChannelsParams = {
  keyword?: string
  publishedAfter: string
  publishedBefore?: string
  regionCode?: string
  relevanceLanguage?: string
  order?: ChannelSearchOrder
  pageToken?: string
}

export type SearchGrowingChannelsResponse = {
  items: GrowingChannel[]
  nextPageToken?: string
  totalResults: number
  quotaUsed: number
}
