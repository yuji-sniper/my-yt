export interface SearchGrowingChannelsUseCasePortInput {
  keyword?: string
  publishedAfter: string
  publishedBefore?: string
  regionCode?: string
  relevanceLanguage?: string
  subscriberCountMin?: number
  subscriberCountMax?: number
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
  growthSpeed: number | null
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
