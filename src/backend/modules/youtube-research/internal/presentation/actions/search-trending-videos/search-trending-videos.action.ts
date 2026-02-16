"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { SearchTrendingVideosResultItem } from "@/backend/modules/youtube-research/internal/application/ports/search-trending-videos.port"
import type {
  SearchTrendingVideosHandler,
  SearchTrendingVideosHandlerInput
} from "@/backend/modules/youtube-research/internal/presentation/handlers/search-trending-videos/search-trending-videos.handler"
import { SearchTrendingVideosHandlerToken } from "@/backend/modules/youtube-research/internal/presentation/handlers/search-trending-videos/search-trending-videos.handler"

export type SearchTrendingVideosActionRequest = SearchTrendingVideosHandlerInput

export type SearchTrendingVideosActionResponse = ActionResponse<{
  items: SearchTrendingVideosResultItem[]
  nextPageToken?: string
  totalResults: number
  quotaUsed: number
}>

export const searchTrendingVideosAction = async (
  request: SearchTrendingVideosActionRequest
): Promise<SearchTrendingVideosActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<SearchTrendingVideosHandler>(
      SearchTrendingVideosHandlerToken
    )
    return handler.handle(request)
  })
}
