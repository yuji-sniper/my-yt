export const VIDEO_DURATIONS = {
  any: "any",
  short: "short",
  medium: "medium",
  long: "long"
} as const
export type VideoDuration =
  (typeof VIDEO_DURATIONS)[keyof typeof VIDEO_DURATIONS]

export const VIDEO_SEARCH_ORDERS = {
  relevance: "relevance",
  date: "date",
  rating: "rating",
  title: "title",
  viewCount: "viewCount"
} as const
export type VideoSearchOrder =
  (typeof VIDEO_SEARCH_ORDERS)[keyof typeof VIDEO_SEARCH_ORDERS]

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
  channelPublishedAt: string
  channelSubscriberCount: number
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

export const VIDEO_SORT_KEYS = {
  viewCount: "viewCount",
  engagementRate: "engagementRate",
  publishedAt: "publishedAt"
} as const
export type SortKey = (typeof VIDEO_SORT_KEYS)[keyof typeof VIDEO_SORT_KEYS]

export type SearchTrendingVideosResponse = {
  items: TrendingVideo[]
  nextPageToken?: string
  totalResults: number
  quotaUsed: number
}

export type ChannelAgeRange =
  | "within1Month"
  | "within3Months"
  | "within6Months"
  | "within1Year"
  | null

export const CHANNEL_AGE_FILTER_KEYS = {
  all: "all",
  within1Month: "within1Month",
  within3Months: "within3Months",
  within6Months: "within6Months",
  within1Year: "within1Year"
} as const
export type ChannelAgeFilterKey =
  (typeof CHANNEL_AGE_FILTER_KEYS)[keyof typeof CHANNEL_AGE_FILTER_KEYS]
