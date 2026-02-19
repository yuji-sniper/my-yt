"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { GetVideoSearchPresetsHandler } from "@/backend/modules/youtube-research/internal/presentation/handlers/get-video-search-presets/get-video-search-presets.handler"
import { GetVideoSearchPresetsHandlerToken } from "@/backend/modules/youtube-research/internal/presentation/handlers/get-video-search-presets/get-video-search-presets.handler"
import type { GetVideoSearchPresetsResultItem } from "@/backend/modules/youtube-research/public/ports/get-video-search-presets.usecase.port"

export type GetVideoSearchPresetsActionResponse = ActionResponse<{
  presets: GetVideoSearchPresetsResultItem[]
}>

export const getVideoSearchPresetsAction =
  async (): Promise<GetVideoSearchPresetsActionResponse> => {
    return withRequestContext(async () => {
      const handler = await resolveContainer<GetVideoSearchPresetsHandler>(
        GetVideoSearchPresetsHandlerToken
      )
      return handler.handle()
    })
  }
