"use client"

import { useMutation } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"
import { createVideoSearchPresetMutation } from "../../mutations/create-video-search-preset"
import { videoSearchPresetsKey } from "../../queries/keys"

export const useCreateVideoSearchPresetMutation = () => {
  return useMutation({
    mutationFn: createVideoSearchPresetMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: videoSearchPresetsKey()
      })
    }
  })
}
