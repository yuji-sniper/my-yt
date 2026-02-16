"use client"

import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { useSearchGrowingChannelsQuery } from "@/features/youtube-research/hooks/queries/useSearchGrowingChannelsQuery"
import type {
  ChannelSortKey,
  GrowingChannel,
  SearchGrowingChannelsParams
} from "@/features/youtube-research/types/growing-channel"
import { ChannelsPresentational } from "./presentational"

const sortChannels = (
  channels: GrowingChannel[],
  sortKey: ChannelSortKey
): GrowingChannel[] => {
  return [...channels].sort((a, b) => {
    switch (sortKey) {
      case "growthSpeed": {
        if (a.growthSpeed === null && b.growthSpeed === null) return 0
        if (a.growthSpeed === null) return 1
        if (b.growthSpeed === null) return -1
        return b.growthSpeed - a.growthSpeed
      }
      case "subscriberCount":
        return b.subscriberCount - a.subscriberCount
      case "viewCount":
        return b.viewCount - a.viewCount
      default:
        return 0
    }
  })
}

export function ChannelsContainer() {
  const locale = useLocale()
  const t = useTranslations("youtubeResearch")

  const [searchParams, setSearchParams] =
    useState<SearchGrowingChannelsParams | null>(null)
  const [sortKey, setSortKey] = useState<ChannelSortKey>("growthSpeed")
  const [pageTokenHistory, setPageTokenHistory] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const {
    data: channelsData,
    isFetching: isChannelsFetching,
    isError: isChannelsError
  } = useSearchGrowingChannelsQuery(searchParams)

  if (isChannelsError) {
    toast.error(t("errors.channelSearchFailed"))
  }

  const handleSearch = (params: SearchGrowingChannelsParams) => {
    setSearchParams(params)
    setPageTokenHistory([])
    setHasSearched(true)
    setSortKey("growthSpeed")
  }

  const handleSortChange = (key: ChannelSortKey) => {
    setSortKey(key)
  }

  const handleNextPage = () => {
    if (!channelsData?.nextPageToken || !searchParams) return
    setPageTokenHistory((prev) => [...prev, searchParams.pageToken ?? ""])
    setSearchParams({ ...searchParams, pageToken: channelsData.nextPageToken })
  }

  const handlePreviousPage = () => {
    if (pageTokenHistory.length === 0 || !searchParams) return
    const prevToken = pageTokenHistory[pageTokenHistory.length - 1]
    setPageTokenHistory((prev) => prev.slice(0, -1))
    setSearchParams({
      ...searchParams,
      pageToken: prevToken || undefined
    })
  }

  const sortedChannels = channelsData
    ? sortChannels(channelsData.items, sortKey)
    : []

  return (
    <ChannelsPresentational
      channels={sortedChannels}
      isLoading={isChannelsFetching}
      hasSearched={hasSearched}
      sortKey={sortKey}
      onSortChange={handleSortChange}
      onSearch={handleSearch}
      hasNextPage={!!channelsData?.nextPageToken}
      canGoPrevious={pageTokenHistory.length > 0}
      onNextPage={handleNextPage}
      onPreviousPage={handlePreviousPage}
      locale={locale}
    />
  )
}
