import { getVideoSearchPresetsAction } from "@/backend/modules/youtube-research/internal/presentation/actions/get-video-search-presets/get-video-search-presets.action"
import { ServerError } from "@/utils/error/server-error"
import type { VideoSearchPreset } from "../types/video-search-preset"

export type GetVideoSearchPresetsResponse = {
  presets: VideoSearchPreset[]
}

export const getVideoSearchPresetsQuery =
  async (): Promise<GetVideoSearchPresetsResponse> => {
    const res = await getVideoSearchPresetsAction()

    if (!res.ok) {
      throw new ServerError(
        res.error.code,
        res.error.status,
        res.error.message,
        res.error.details
      )
    }

    const presets: VideoSearchPreset[] = res.data.presets.map((p) => ({
      id: p.id,
      name: p.name,
      searchParams: p.searchParams,
      createdAt:
        p.createdAt instanceof Date
          ? p.createdAt.toISOString()
          : String(p.createdAt)
    }))

    return { presets }
  }
