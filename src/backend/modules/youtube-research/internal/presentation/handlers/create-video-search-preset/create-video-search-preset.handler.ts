import { inject, injectable } from "tsyringe"
import { z } from "zod"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import {
  VideoSearchPresetDuplicateNameError,
  VideoSearchPresetLimitExceededError
} from "@/backend/modules/youtube-research/public/errors/video-search-preset.errors"
import type {
  CreateVideoSearchPresetResultItem,
  CreateVideoSearchPresetUseCasePort
} from "@/backend/modules/youtube-research/public/ports/create-video-search-preset.usecase.port"
import { CreateVideoSearchPresetUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/create-video-search-preset.usecase.port"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"
import { VIDEO_SEARCH_PRESET_ERROR_CODES } from "@/shared/errors/video-search-preset.errors"

const createVideoSearchPresetSchema = z.object({
  name: z.string().min(1).max(100),
  searchParams: z.record(z.string(), z.unknown())
})

export type CreateVideoSearchPresetHandlerInput = z.input<
  typeof createVideoSearchPresetSchema
>

export type CreateVideoSearchPresetHandlerResult = Result<{
  preset: CreateVideoSearchPresetResultItem
}>

export const CreateVideoSearchPresetHandlerToken = Symbol(
  "CreateVideoSearchPresetHandler"
)

export interface CreateVideoSearchPresetHandler {
  handle(
    input: CreateVideoSearchPresetHandlerInput
  ): Promise<CreateVideoSearchPresetHandlerResult>
}

@injectable()
export class CreateVideoSearchPresetHandlerImpl
  implements CreateVideoSearchPresetHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(CreateVideoSearchPresetUseCasePortToken)
    private readonly createVideoSearchPresetUseCase: CreateVideoSearchPresetUseCasePort
  ) {}

  async handle(
    input: CreateVideoSearchPresetHandlerInput
  ): Promise<CreateVideoSearchPresetHandlerResult> {
    const parsed = createVideoSearchPresetSchema.safeParse(input)

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
      const output = await this.createVideoSearchPresetUseCase.handle(
        parsed.data
      )

      return {
        ok: true,
        data: output
      }
    } catch (e: unknown) {
      if (e instanceof VideoSearchPresetLimitExceededError) {
        return {
          ok: false,
          error: {
            code: VIDEO_SEARCH_PRESET_ERROR_CODES.LIMIT_EXCEEDED,
            status: 422,
            message: e.message
          }
        }
      }

      if (e instanceof VideoSearchPresetDuplicateNameError) {
        return {
          ok: false,
          error: {
            code: VIDEO_SEARCH_PRESET_ERROR_CODES.DUPLICATE_NAME,
            status: 409,
            message: e.message
          }
        }
      }

      this.logger.error("Failed to create video search preset", {
        name: parsed.data.name,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: VIDEO_SEARCH_PRESET_ERROR_CODES.CREATE_FAILED,
          status: 500,
          message: "Failed to create video search preset"
        }
      }
    }
  }
}
