"use client"

import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useSearchGrowingChannelsQuery } from "@/features/youtube-research/hooks/queries/useSearchGrowingChannelsQuery"
import {
  CHANNEL_SORT_KEYS,
  type ChannelSortKey,
  type GrowingChannel,
  type SearchGrowingChannelsParams
} from "@/features/youtube-research/types/growing-channel"
import { ChannelsPresentational } from "./presentational"

const sortChannels = (
  channels: GrowingChannel[],
  sortKey: ChannelSortKey
): GrowingChannel[] => {
  return [...channels].sort((a, b) => {
    switch (sortKey) {
      case CHANNEL_SORT_KEYS.growthSpeed:
        return b.growthSpeed - a.growthSpeed
      case CHANNEL_SORT_KEYS.subscriberCount:
        return b.subscriberCount - a.subscriberCount
      case CHANNEL_SORT_KEYS.viewCount:
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
  const [sortKey, setSortKey] = useState<ChannelSortKey>(
    CHANNEL_SORT_KEYS.growthSpeed
  )
  const [pageTokenHistory, setPageTokenHistory] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const {
    data: channelsData,
    isFetching: isChannelsFetching,
    isError: isChannelsError
  } = useSearchGrowingChannelsQuery(searchParams)

  useEffect(() => {
    if (isChannelsError) {
      toast.error(t("errors.channelSearchFailed"))
    }
  }, [isChannelsError, t])

  const handleSearch = (params: SearchGrowingChannelsParams) => {
    setSearchParams(params)
    setPageTokenHistory([])
    setHasSearched(true)
    setSortKey(CHANNEL_SORT_KEYS.viewCount)
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
