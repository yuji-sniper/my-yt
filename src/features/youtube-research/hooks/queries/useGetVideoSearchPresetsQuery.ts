import { useQuery } from "@tanstack/react-query"
import { getVideoSearchPresetsQuery } from "../../queries/get-video-search-presets"
import { videoSearchPresetsKey } from "../../queries/keys"

export const useGetVideoSearchPresetsQuery = () => {
  return useQuery({
    queryKey: videoSearchPresetsKey(),
    queryFn: getVideoSearchPresetsQuery
  })
}
