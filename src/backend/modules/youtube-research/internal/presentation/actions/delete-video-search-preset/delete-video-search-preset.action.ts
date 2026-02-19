"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type {
  DeleteVideoSearchPresetHandler,
  DeleteVideoSearchPresetHandlerInput
} from "@/backend/modules/youtube-research/internal/presentation/handlers/delete-video-search-preset/delete-video-search-preset.handler"
import { DeleteVideoSearchPresetHandlerToken } from "@/backend/modules/youtube-research/internal/presentation/handlers/delete-video-search-preset/delete-video-search-preset.handler"

export type DeleteVideoSearchPresetActionRequest =
  DeleteVideoSearchPresetHandlerInput

export type DeleteVideoSearchPresetActionResponse = ActionResponse<void>

export const deleteVideoSearchPresetAction = async (
  request: DeleteVideoSearchPresetActionRequest
): Promise<DeleteVideoSearchPresetActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<DeleteVideoSearchPresetHandler>(
      DeleteVideoSearchPresetHandlerToken
    )
    return handler.handle(request)
  })
}
