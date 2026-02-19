import { createVideoSearchPresetAction } from "@/backend/modules/youtube-research/internal/presentation/actions/create-video-search-preset/create-video-search-preset.action"
import { ServerError } from "@/utils/error/server-error"

export type CreateVideoSearchPresetInput = {
  name: string
  searchParams: Record<string, unknown>
}

export const createVideoSearchPresetMutation = async (
  input: CreateVideoSearchPresetInput
) => {
  const res = await createVideoSearchPresetAction({
    name: input.name,
    searchParams: input.searchParams
  })

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
