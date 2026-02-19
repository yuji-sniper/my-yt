"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type {
  CreateVideoSearchPresetHandler,
  CreateVideoSearchPresetHandlerInput
} from "@/backend/modules/youtube-research/internal/presentation/handlers/create-video-search-preset/create-video-search-preset.handler"
import { CreateVideoSearchPresetHandlerToken } from "@/backend/modules/youtube-research/internal/presentation/handlers/create-video-search-preset/create-video-search-preset.handler"
import type { CreateVideoSearchPresetResultItem } from "@/backend/modules/youtube-research/public/ports/create-video-search-preset.usecase.port"

export type CreateVideoSearchPresetActionRequest =
  CreateVideoSearchPresetHandlerInput

export type CreateVideoSearchPresetActionResponse = ActionResponse<{
  preset: CreateVideoSearchPresetResultItem
}>

export const createVideoSearchPresetAction = async (
  request: CreateVideoSearchPresetActionRequest
): Promise<CreateVideoSearchPresetActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<CreateVideoSearchPresetHandler>(
      CreateVideoSearchPresetHandlerToken
    )
    return handler.handle(request)
  })
}
