"use client"

import { skipToken, useQuery } from "@tanstack/react-query"
import { trendingVideosKey } from "../../queries/keys"
import { searchTrendingVideosQuery } from "../../queries/search-trending-videos"
import type { SearchTrendingVideosParams } from "../../types/trending-video"

export const useSearchTrendingVideosQuery = (
  params: SearchTrendingVideosParams | null
) => {
  return useQuery({
    queryKey: trendingVideosKey(params ?? { publishedAfter: "" }),
    queryFn: params ? () => searchTrendingVideosQuery(params) : skipToken
  })
}
