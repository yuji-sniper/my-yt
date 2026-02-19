import { inject, injectable } from "tsyringe"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import type {
  GetVideoSearchPresetsResultItem,
  GetVideoSearchPresetsUseCasePort
} from "@/backend/modules/youtube-research/public/ports/get-video-search-presets.usecase.port"
import { GetVideoSearchPresetsUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/get-video-search-presets.usecase.port"
import { VIDEO_SEARCH_PRESET_ERROR_CODES } from "@/shared/errors/video-search-preset.errors"

export type GetVideoSearchPresetsHandlerResult = Result<{
  presets: GetVideoSearchPresetsResultItem[]
}>

export const GetVideoSearchPresetsHandlerToken = Symbol(
  "GetVideoSearchPresetsHandler"
)

export interface GetVideoSearchPresetsHandler {
  handle(): Promise<GetVideoSearchPresetsHandlerResult>
}

@injectable()
export class GetVideoSearchPresetsHandlerImpl
  implements GetVideoSearchPresetsHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(GetVideoSearchPresetsUseCasePortToken)
    private readonly getVideoSearchPresetsUseCase: GetVideoSearchPresetsUseCasePort
  ) {}

  async handle(): Promise<GetVideoSearchPresetsHandlerResult> {
    try {
      const output = await this.getVideoSearchPresetsUseCase.handle()

      return {
        ok: true,
        data: output
      }
    } catch (e: unknown) {
      this.logger.error("Failed to get video search presets", {
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: VIDEO_SEARCH_PRESET_ERROR_CODES.GET_FAILED,
          status: 500,
          message: "Failed to get video search presets"
        }
      }
    }
  }
}
