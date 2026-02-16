import { inject, injectable } from "tsyringe"
import { z } from "zod"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { YouTubeApiRequestFailedError } from "@/backend/modules/youtube-research/public/errors/youtube-research.errors"
import type {
  SearchGrowingChannelsResultItem,
  SearchGrowingChannelsUseCasePort
} from "@/backend/modules/youtube-research/public/ports/search-growing-channels.usecase.port"
import { SearchGrowingChannelsUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/search-growing-channels.usecase.port"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"
import { YOUTUBE_RESEARCH_ERROR_CODES } from "@/shared/errors/youtube-research.errors"

const searchGrowingChannelsSchema = z.object({
  keyword: z.string().optional(),
  publishedAfter: z.string(),
  publishedBefore: z.string().optional(),
  regionCode: z.string().length(2).optional(),
  relevanceLanguage: z.string().min(2).max(5).optional(),
  subscriberCountMin: z.number().int().min(0).optional(),
  subscriberCountMax: z.number().int().min(0).optional(),
  pageToken: z.string().optional()
})

export type SearchGrowingChannelsHandlerInput = z.input<
  typeof searchGrowingChannelsSchema
>

export type SearchGrowingChannelsHandlerResult = Result<{
  items: SearchGrowingChannelsResultItem[]
  nextPageToken?: string
  totalResults: number
  quotaUsed: number
}>

export const SearchGrowingChannelsHandlerToken = Symbol(
  "SearchGrowingChannelsHandler"
)

export interface SearchGrowingChannelsHandler {
  handle(
    input: SearchGrowingChannelsHandlerInput
  ): Promise<SearchGrowingChannelsHandlerResult>
}

@injectable()
export class SearchGrowingChannelsHandlerImpl
  implements SearchGrowingChannelsHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(SearchGrowingChannelsUseCasePortToken)
    private readonly searchGrowingChannelsUseCase: SearchGrowingChannelsUseCasePort
  ) {}

  async handle(
    input: SearchGrowingChannelsHandlerInput
  ): Promise<SearchGrowingChannelsHandlerResult> {
    const parsed = searchGrowingChannelsSchema.safeParse(input)

    if (!parsed.success) {
      return {
        ok: false,
        error: {
          code: COMMON_ERROR_CODES.VALIDATION_ERROR,
          status: 422,
          message: "Validation failed",
          fieldErrors: formatZodErrors(parsed.error)
        }
      }
    }

    try {
      const output = await this.searchGrowingChannelsUseCase.handle(parsed.data)

      return {
        ok: true,
        data: output
      }
    } catch (e: unknown) {
      if (e instanceof YouTubeApiRequestFailedError) {
        return {
          ok: false,
          error: {
            code: YOUTUBE_RESEARCH_ERROR_CODES.API_REQUEST_FAILED,
            status: 502,
            message: e.message
          }
        }
      }

      this.logger.error("Failed to search growing channels", {
        keyword: parsed.data.keyword,
        publishedAfter: parsed.data.publishedAfter,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: YOUTUBE_RESEARCH_ERROR_CODES.SEARCH_FAILED,
          status: 500,
          message: "Failed to search growing channels"
        }
      }
    }
  }
}
