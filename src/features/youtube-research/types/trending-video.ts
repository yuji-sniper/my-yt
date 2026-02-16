export const VIDEO_DURATION_VALUES = ["any", "short", "medium", "long"] as const
export type VideoDuration = (typeof VIDEO_DURATION_VALUES)[number]

export const VIDEO_SEARCH_ORDER_VALUES = [
  "relevance",
  "date",
  "rating",
  "title",
  "viewCount"
] as const
export type VideoSearchOrder = (typeof VIDEO_SEARCH_ORDER_VALUES)[number]

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
