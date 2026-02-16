import type { SearchTrendingVideosParams } from "../types/trending-video"

export const trendingVideosKey = (params: SearchTrendingVideosParams) =>
  ["trending-videos", params] as const

export const videoCategoriesKey = () => ["video-categories"] as const
