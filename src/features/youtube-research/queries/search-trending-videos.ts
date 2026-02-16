import { searchTrendingVideosAction } from "@/backend/modules/youtube-research/internal/presentation/actions/search-trending-videos/search-trending-videos.action"
import { ServerError } from "@/utils/error/server-error"
import type {
  SearchTrendingVideosParams,
  SearchTrendingVideosResponse
} from "../types/trending-video"

export const searchTrendingVideosQuery = async (
  params: SearchTrendingVideosParams
): Promise<SearchTrendingVideosResponse> => {
  const res = await searchTrendingVideosAction(params)

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  return res.data
}
