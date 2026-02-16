import type {
  VideoDuration,
  VideoSearchOrder
} from "@/backend/modules/youtube-research/internal/domain/youtube-api/youtube-api.types"

export type TrendingVideo = {
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

export type SearchTrendingVideosParams = {
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

export type SortKey = "viewCount" | "engagementRate" | "publishedAt"

export type SearchTrendingVideosResponse = {
  items: TrendingVideo[]
  nextPageToken?: string
  totalResults: number
  quotaUsed: number
}
