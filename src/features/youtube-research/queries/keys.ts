import type { SearchGrowingChannelsParams } from "../types/growing-channel"
import type { SearchTrendingVideosParams } from "../types/trending-video"

export const trendingVideosKey = (params: SearchTrendingVideosParams) =>
  ["trending-videos", params] as const

export const videoCategoriesKey = () => ["video-categories"] as const

export const growingChannelsKey = (params: SearchGrowingChannelsParams) =>
  ["growing-channels", params] as const
