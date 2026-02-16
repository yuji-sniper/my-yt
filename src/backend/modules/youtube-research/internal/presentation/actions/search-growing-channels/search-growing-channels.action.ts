"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type {
  SearchGrowingChannelsHandler,
  SearchGrowingChannelsHandlerInput
} from "@/backend/modules/youtube-research/internal/presentation/handlers/search-growing-channels/search-growing-channels.handler"
import { SearchGrowingChannelsHandlerToken } from "@/backend/modules/youtube-research/internal/presentation/handlers/search-growing-channels/search-growing-channels.handler"
import type { SearchGrowingChannelsResultItem } from "@/backend/modules/youtube-research/public/ports/search-growing-channels.usecase.port"

export type SearchGrowingChannelsActionRequest =
  SearchGrowingChannelsHandlerInput

export type SearchGrowingChannelsActionResponse = ActionResponse<{
  items: SearchGrowingChannelsResultItem[]
  nextPageToken?: string
  totalResults: number
  quotaUsed: number
}>

export const searchGrowingChannelsAction = async (
  request: SearchGrowingChannelsActionRequest
): Promise<SearchGrowingChannelsActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<SearchGrowingChannelsHandler>(
      SearchGrowingChannelsHandlerToken
    )
    return handler.handle(request)
  })
}
