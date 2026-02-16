import { inject, injectable } from "tsyringe"
import { z } from "zod"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import type { SearchTrendingVideosResultItem } from "@/backend/modules/youtube-research/internal/application/ports/search-trending-videos.port"
import { YouTubeApiRequestFailedError } from "@/backend/modules/youtube-research/public/errors/youtube-research.errors"
import type { SearchTrendingVideosUseCasePort } from "@/backend/modules/youtube-research/public/ports/search-trending-videos.usecase.port"
import { SearchTrendingVideosUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/search-trending-videos.usecase.port"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"
import { YOUTUBE_RESEARCH_ERROR_CODES } from "@/shared/errors/youtube-research.errors"

const searchTrendingVideosSchema = z.object({
  keyword: z.string().optional(),
  categoryId: z.string().optional(),
  publishedAfter: z.string(),
  publishedBefore: z.string().optional(),
  regionCode: z.string().length(2).optional(),
  relevanceLanguage: z.string().min(2).max(5).optional(),
  videoDuration: z.enum(["any", "short", "medium", "long"]).optional(),
  pageToken: z.string().optional()
})

export type SearchTrendingVideosHandlerInput = z.input<
  typeof searchTrendingVideosSchema
>

export type SearchTrendingVideosHandlerResult = Result<{
  items: SearchTrendingVideosResultItem[]
  nextPageToken?: string
  totalResults: number
  quotaUsed: number
}>

export const SearchTrendingVideosHandlerToken = Symbol(
  "SearchTrendingVideosHandler"
)

export interface SearchTrendingVideosHandler {
  handle(
    input: SearchTrendingVideosHandlerInput
  ): Promise<SearchTrendingVideosHandlerResult>
}

@injectable()
export class SearchTrendingVideosHandlerImpl
  implements SearchTrendingVideosHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(SearchTrendingVideosUseCasePortToken)
    private readonly searchTrendingVideosUseCase: SearchTrendingVideosUseCasePort
  ) {}

  async handle(
    input: SearchTrendingVideosHandlerInput
  ): Promise<SearchTrendingVideosHandlerResult> {
    const parsed = searchTrendingVideosSchema.safeParse(input)

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
      const output = await this.searchTrendingVideosUseCase.handle(parsed.data)

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

      this.logger.error("Failed to search trending videos", {
        keyword: parsed.data.keyword,
        publishedAfter: parsed.data.publishedAfter,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: YOUTUBE_RESEARCH_ERROR_CODES.SEARCH_FAILED,
          status: 500,
          message: "Failed to search trending videos"
        }
      }
    }
  }
}
