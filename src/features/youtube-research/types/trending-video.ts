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
  videoDuration?: "any" | "short" | "medium" | "long"
  pageToken?: string
}

export type SortKey = "viewCount" | "engagementRate" | "publishedAt"

export type SearchTrendingVideosResponse = {
  items: TrendingVideo[]
  nextPageToken?: string
  totalResults: number
  quotaUsed: number
}
