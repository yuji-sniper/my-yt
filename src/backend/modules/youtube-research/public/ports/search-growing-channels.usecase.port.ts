import type { ChannelSearchOrder } from "@/backend/modules/youtube-research/internal/domain/youtube-api/youtube-api.types"

export interface SearchGrowingChannelsUseCasePortInput {
  keyword?: string
  publishedAfter: string
  publishedBefore?: string
  regionCode?: string
  relevanceLanguage?: string
  order?: ChannelSearchOrder
  pageToken?: string
}

export interface SearchGrowingChannelsResultItem {
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

export interface SearchGrowingChannelsUseCasePortOutput {
  items: SearchGrowingChannelsResultItem[]
  nextPageToken?: string
  totalResults: number
  quotaUsed: number
}

export interface SearchGrowingChannelsUseCasePort {
  handle(
    input: SearchGrowingChannelsUseCasePortInput
  ): Promise<SearchGrowingChannelsUseCasePortOutput>
}

export const SearchGrowingChannelsUseCasePortToken = Symbol(
  "SearchGrowingChannelsUseCasePort"
)
