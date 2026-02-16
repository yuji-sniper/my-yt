"use client"

import { skipToken, useQuery } from "@tanstack/react-query"
import { growingChannelsKey } from "../../queries/keys"
import { searchGrowingChannelsQuery } from "../../queries/search-growing-channels"
import type { SearchGrowingChannelsParams } from "../../types/growing-channel"

export const useSearchGrowingChannelsQuery = (
  params: SearchGrowingChannelsParams | null
) => {
  return useQuery({
    queryKey: growingChannelsKey(params ?? { publishedAfter: "" }),
    queryFn: params ? () => searchGrowingChannelsQuery(params) : skipToken
  })
}
