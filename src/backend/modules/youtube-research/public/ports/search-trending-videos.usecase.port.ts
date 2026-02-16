import type {
  VideoDuration,
  VideoSearchOrder
} from "@/backend/modules/youtube-research/internal/domain/youtube-api/youtube-api.types"

export interface SearchTrendingVideosUseCasePortInput {
  keyword?: string
  categoryId?: string
  publishedAfter: string
  publishedBefore?: string
  regionCode?: string
  relevanceLanguage?: string
  videoDuration?: VideoDuration
  order?: VideoSearchOrder
  pageToken?: string
}

export interface SearchTrendingVideosResultItem {
  videoId: string
  title: string
  thumbnailUrl: string
  channelId: string
  channelTitle: string
  viewCount: number
  likeCount: number
  commentCount: number
  duration: string
  publishedAt: string
  engagementRate: number
}

export interface SearchTrendingVideosUseCasePortOutput {
  items: SearchTrendingVideosResultItem[]
  nextPageToken?: string
  totalResults: number
  quotaUsed: number
}

export interface SearchTrendingVideosUseCasePort {
  handle(
    input: SearchTrendingVideosUseCasePortInput
  ): Promise<SearchTrendingVideosUseCasePortOutput>
}

export const SearchTrendingVideosUseCasePortToken = Symbol(
  "SearchTrendingVideosUseCasePort"
)
