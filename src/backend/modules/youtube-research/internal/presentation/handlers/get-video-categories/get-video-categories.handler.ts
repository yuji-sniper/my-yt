import { inject, injectable } from "tsyringe"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { YouTubeApiRequestFailedError } from "@/backend/modules/youtube-research/public/errors/youtube-research.errors"
import type {
  GetVideoCategoriesResultItem,
  GetVideoCategoriesUseCasePort
} from "@/backend/modules/youtube-research/public/ports/get-video-categories.usecase.port"
import { GetVideoCategoriesUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/get-video-categories.usecase.port"
import { YOUTUBE_RESEARCH_ERROR_CODES } from "@/shared/errors/youtube-research.errors"

export type GetVideoCategoriesHandlerResult = Result<{
  items: GetVideoCategoriesResultItem[]
}>

export const GetVideoCategoriesHandlerToken = Symbol(
  "GetVideoCategoriesHandler"
)

export interface GetVideoCategoriesHandler {
  handle(): Promise<GetVideoCategoriesHandlerResult>
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

  async handle(): Promise<GetVideoCategoriesHandlerResult> {
    try {
      const output = await this.getVideoCategoriesUseCase.handle()

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
