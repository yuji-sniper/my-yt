import { getVideoCategoriesAction } from "@/backend/modules/youtube-research/internal/presentation/actions/get-video-categories/get-video-categories.action"
import { ServerError } from "@/utils/error/server-error"
import type { VideoCategory } from "../types/video-category"

export const getVideoCategoriesQuery = async (): Promise<{
  items: VideoCategory[]
}> => {
  const res = await getVideoCategoriesAction()

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  return res.data
}
