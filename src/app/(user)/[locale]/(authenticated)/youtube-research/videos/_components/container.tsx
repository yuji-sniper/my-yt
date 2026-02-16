"use client"

import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { useGetVideoCategoriesQuery } from "@/features/youtube-research/hooks/queries/useGetVideoCategoriesQuery"
import { useSearchTrendingVideosQuery } from "@/features/youtube-research/hooks/queries/useSearchTrendingVideosQuery"
import type {
  SearchTrendingVideosParams,
  SortKey,
  TrendingVideo
} from "@/features/youtube-research/types/trending-video"
import { VideosPresentational } from "./presentational"

const sortVideos = (
  videos: TrendingVideo[],
  sortKey: SortKey
): TrendingVideo[] => {
  return [...videos].sort((a, b) => {
    switch (sortKey) {
      case "viewCount":
        return b.viewCount - a.viewCount
      case "engagementRate":
        return b.engagementRate - a.engagementRate
      case "publishedAt":
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        )
      default:
        return 0
    }
  })
}

export function VideosContainer() {
  const locale = useLocale()
  const t = useTranslations("youtubeResearch")

  const [searchParams, setSearchParams] =
    useState<SearchTrendingVideosParams | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>("viewCount")
  const [pageTokenHistory, setPageTokenHistory] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const { data: categoriesData } = useGetVideoCategoriesQuery()
  const {
    data: videosData,
    isFetching: isVideosFetching,
    isError: isVideosError
  } = useSearchTrendingVideosQuery(searchParams)

  if (isVideosError) {
    toast.error(t("errors.searchFailed"))
  }

  const handleSearch = (params: SearchTrendingVideosParams) => {
    setSearchParams(params)
    setPageTokenHistory([])
    setHasSearched(true)
    setSortKey("viewCount")
  }

  const handleSortChange = (key: SortKey) => {
    setSortKey(key)
  }

  const handleNextPage = () => {
    if (!videosData?.nextPageToken || !searchParams) return
    setPageTokenHistory((prev) => [...prev, searchParams.pageToken ?? ""])
    setSearchParams({ ...searchParams, pageToken: videosData.nextPageToken })
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

  const sortedVideos = videosData ? sortVideos(videosData.items, sortKey) : []

  return (
    <VideosPresentational
      videos={sortedVideos}
      categories={categoriesData?.items ?? []}
      isLoading={isVideosFetching}
      hasSearched={hasSearched}
      sortKey={sortKey}
      onSortChange={handleSortChange}
      onSearch={handleSearch}
      hasNextPage={!!videosData?.nextPageToken}
      canGoPrevious={pageTokenHistory.length > 0}
      onNextPage={handleNextPage}
      onPreviousPage={handlePreviousPage}
      locale={locale}
    />
  )
}
