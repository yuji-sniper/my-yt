import { inject, injectable } from "tsyringe"
import { z } from "zod"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { VideoSearchPresetNotFoundError } from "@/backend/modules/youtube-research/public/errors/video-search-preset.errors"
import type { DeleteVideoSearchPresetUseCasePort } from "@/backend/modules/youtube-research/public/ports/delete-video-search-preset.usecase.port"
import { DeleteVideoSearchPresetUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/delete-video-search-preset.usecase.port"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"
import { VIDEO_SEARCH_PRESET_ERROR_CODES } from "@/shared/errors/video-search-preset.errors"

const deleteVideoSearchPresetSchema = z.object({
  presetId: z.string().min(1)
})

export type DeleteVideoSearchPresetHandlerInput = z.input<
  typeof deleteVideoSearchPresetSchema
>

export type DeleteVideoSearchPresetHandlerResult = Result<void>

export const DeleteVideoSearchPresetHandlerToken = Symbol(
  "DeleteVideoSearchPresetHandler"
)

export interface DeleteVideoSearchPresetHandler {
  handle(
    input: DeleteVideoSearchPresetHandlerInput
  ): Promise<DeleteVideoSearchPresetHandlerResult>
}

@injectable()
export class DeleteVideoSearchPresetHandlerImpl
  implements DeleteVideoSearchPresetHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(DeleteVideoSearchPresetUseCasePortToken)
    private readonly deleteVideoSearchPresetUseCase: DeleteVideoSearchPresetUseCasePort
  ) {}

  async handle(
    input: DeleteVideoSearchPresetHandlerInput
  ): Promise<DeleteVideoSearchPresetHandlerResult> {
    const parsed = deleteVideoSearchPresetSchema.safeParse(input)

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
      await this.deleteVideoSearchPresetUseCase.handle({
        presetId: parsed.data.presetId
      })

      return {
        ok: true,
        data: undefined
      }
    } catch (e: unknown) {
      if (e instanceof VideoSearchPresetNotFoundError) {
        return {
          ok: false,
          error: {
            code: VIDEO_SEARCH_PRESET_ERROR_CODES.NOT_FOUND,
            status: 404,
            message: e.message
          }
        }
      }

      this.logger.error("Failed to delete video search preset", {
        presetId: parsed.data.presetId,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: VIDEO_SEARCH_PRESET_ERROR_CODES.DELETE_FAILED,
          status: 500,
          message: "Failed to delete video search preset"
        }
      }
    }
  }
}
