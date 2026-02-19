import { deleteVideoSearchPresetAction } from "@/backend/modules/youtube-research/internal/presentation/actions/delete-video-search-preset/delete-video-search-preset.action"
import { ServerError } from "@/utils/error/server-error"

export type DeleteVideoSearchPresetInput = {
  presetId: string
}

export const deleteVideoSearchPresetMutation = async ({
  presetId
}: DeleteVideoSearchPresetInput): Promise<void> => {
  const res = await deleteVideoSearchPresetAction({ presetId })

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }
}
