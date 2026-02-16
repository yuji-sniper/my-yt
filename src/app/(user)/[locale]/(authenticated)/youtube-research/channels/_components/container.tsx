"use client"

import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useSearchGrowingChannelsQuery } from "@/features/youtube-research/hooks/queries/useSearchGrowingChannelsQuery"
import type { SearchGrowingChannelsParams } from "@/features/youtube-research/types/growing-channel"
import { ChannelsPresentational } from "./presentational"

export function ChannelsContainer() {
  const locale = useLocale()
  const t = useTranslations("youtubeResearch")

  const [searchParams, setSearchParams] =
    useState<SearchGrowingChannelsParams | null>(null)
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

  return (
    <ChannelsPresentational
      channels={channelsData?.items ?? []}
      isLoading={isChannelsFetching}
      hasSearched={hasSearched}
      onSearch={handleSearch}
      hasNextPage={!!channelsData?.nextPageToken}
      canGoPrevious={pageTokenHistory.length > 0}
      onNextPage={handleNextPage}
      onPreviousPage={handlePreviousPage}
      locale={locale}
    />
  )
}
