"use client"

import { useMutation } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"
import { deleteVideoSearchPresetMutation } from "../../mutations/delete-video-search-preset"
import { videoSearchPresetsKey } from "../../queries/keys"

export const useDeleteVideoSearchPresetMutation = () => {
  return useMutation({
    mutationFn: deleteVideoSearchPresetMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: videoSearchPresetsKey()
      })
    }
  })
}
