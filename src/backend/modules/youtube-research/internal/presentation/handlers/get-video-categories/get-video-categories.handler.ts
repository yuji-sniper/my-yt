import { inject, injectable } from "tsyringe"
import { z } from "zod"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { YouTubeApiRequestFailedError } from "@/backend/modules/youtube-research/public/errors/youtube-research.errors"
import type {
  GetVideoCategoriesResultItem,
  GetVideoCategoriesUseCasePort
} from "@/backend/modules/youtube-research/public/ports/get-video-categories.usecase.port"
import { GetVideoCategoriesUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/get-video-categories.usecase.port"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"
import { YOUTUBE_RESEARCH_ERROR_CODES } from "@/shared/errors/youtube-research.errors"

const getVideoCategoriesSchema = z.object({
  regionCode: z.string().length(2)
})

export type GetVideoCategoriesHandlerInput = z.input<
  typeof getVideoCategoriesSchema
>

export type GetVideoCategoriesHandlerResult = Result<{
  items: GetVideoCategoriesResultItem[]
}>

export const GetVideoCategoriesHandlerToken = Symbol(
  "GetVideoCategoriesHandler"
)

export interface GetVideoCategoriesHandler {
  handle(
    input: GetVideoCategoriesHandlerInput
  ): Promise<GetVideoCategoriesHandlerResult>
}

@injectable()
export class GetVideoCategoriesHandlerImpl
  implements GetVideoCategoriesHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(GetVideoCategoriesUseCasePortToken)
    private readonly getVideoCategoriesUseCase: GetVideoCategoriesUseCasePort
  ) {}

  async handle(
    input: GetVideoCategoriesHandlerInput
  ): Promise<GetVideoCategoriesHandlerResult> {
    const parsed = getVideoCategoriesSchema.safeParse(input)

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
      const output = await this.getVideoCategoriesUseCase.handle(parsed.data)

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

      this.logger.error("Failed to get video categories", {
        regionCode: parsed.data.regionCode,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: YOUTUBE_RESEARCH_ERROR_CODES.GET_CATEGORIES_FAILED,
          status: 500,
          message: "Failed to get video categories"
        }
      }
    }
  }
}
