"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { GetVideoCategoriesHandler } from "@/backend/modules/youtube-research/internal/presentation/handlers/get-video-categories/get-video-categories.handler"
import { GetVideoCategoriesHandlerToken } from "@/backend/modules/youtube-research/internal/presentation/handlers/get-video-categories/get-video-categories.handler"
import type { GetVideoCategoriesResultItem } from "@/backend/modules/youtube-research/public/ports/get-video-categories.usecase.port"

export type GetVideoCategoriesActionResponse = ActionResponse<{
  items: GetVideoCategoriesResultItem[]
}>

export const getVideoCategoriesAction =
  async (): Promise<GetVideoCategoriesActionResponse> => {
    return withRequestContext(async () => {
      const handler = await resolveContainer<GetVideoCategoriesHandler>(
        GetVideoCategoriesHandlerToken
      )
      return handler.handle()
    })
  }
