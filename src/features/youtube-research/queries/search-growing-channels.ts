import { searchGrowingChannelsAction } from "@/backend/modules/youtube-research/internal/presentation/actions/search-growing-channels/search-growing-channels.action"
import { ServerError } from "@/utils/error/server-error"
import type {
  SearchGrowingChannelsParams,
  SearchGrowingChannelsResponse
} from "../types/growing-channel"

export const searchGrowingChannelsQuery = async (
  params: SearchGrowingChannelsParams
): Promise<SearchGrowingChannelsResponse> => {
  const res = await searchGrowingChannelsAction(params)

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
