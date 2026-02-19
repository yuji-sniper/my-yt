"use client"

import { useLocale, useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import type { VideoSearchFormRef } from "@/features/youtube-research/components/ui/VideoSearchForm"
import { useCreateVideoSearchPresetMutation } from "@/features/youtube-research/hooks/mutations/useCreateVideoSearchPresetMutation"
import { useDeleteVideoSearchPresetMutation } from "@/features/youtube-research/hooks/mutations/useDeleteVideoSearchPresetMutation"
import { useGetVideoCategoriesQuery } from "@/features/youtube-research/hooks/queries/useGetVideoCategoriesQuery"
import { useGetVideoSearchPresetsQuery } from "@/features/youtube-research/hooks/queries/useGetVideoSearchPresetsQuery"
import { useSearchTrendingVideosQuery } from "@/features/youtube-research/hooks/queries/useSearchTrendingVideosQuery"
import {
  CHANNEL_AGE_FILTER_KEYS,
  type ChannelAgeFilterKey,
  type SearchTrendingVideosParams,
  type SortKey,
  type TrendingVideo,
  VIDEO_SORT_KEYS
} from "@/features/youtube-research/types/trending-video"
import { isWithinChannelAge } from "@/features/youtube-research/utils/channel-age"
import { VIDEO_SEARCH_PRESET_ERROR_CODES } from "@/shared/errors/video-search-preset.errors"
import { ServerError } from "@/utils/error/server-error"
import { VideosPresentational } from "./presentational"

const sortVideos = (
  videos: TrendingVideo[],
  sortKey: SortKey
): TrendingVideo[] => {
  return [...videos].sort((a, b) => {
    switch (sortKey) {
      case VIDEO_SORT_KEYS.viewCount:
        return b.viewCount - a.viewCount
      case VIDEO_SORT_KEYS.engagementRate:
        return b.engagementRate - a.engagementRate
      case VIDEO_SORT_KEYS.publishedAt:
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

  const formRef = useRef<VideoSearchFormRef>(null)

  const [searchParams, setSearchParams] =
    useState<SearchTrendingVideosParams | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>(VIDEO_SORT_KEYS.viewCount)
  const [channelAgeFilter, setChannelAgeFilter] = useState<ChannelAgeFilterKey>(
    CHANNEL_AGE_FILTER_KEYS.all
  )
  const [pageTokenHistory, setPageTokenHistory] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isSavePresetDialogOpen, setIsSavePresetDialogOpen] = useState(false)

  const { data: categoriesData } = useGetVideoCategoriesQuery()
  const {
    data: videosData,
    isFetching: isVideosFetching,
    isError: isVideosError
  } = useSearchTrendingVideosQuery(searchParams)

  const { data: presetsData } = useGetVideoSearchPresetsQuery()
  const createPresetMutation = useCreateVideoSearchPresetMutation()
  const deletePresetMutation = useDeleteVideoSearchPresetMutation()

  useEffect(() => {
    if (isVideosError) {
      toast.error(t("errors.searchFailed"))
    }
  }, [isVideosError, t])

  const handleSearch = (params: SearchTrendingVideosParams) => {
    setSearchParams(params)
    setPageTokenHistory([])
    setHasSearched(true)
    setSortKey(VIDEO_SORT_KEYS.viewCount)
    setChannelAgeFilter(CHANNEL_AGE_FILTER_KEYS.all)
  }

  const handleSortChange = (key: SortKey) => {
    setSortKey(key)
  }

  const handleChannelAgeFilterChange = (key: ChannelAgeFilterKey) => {
    setChannelAgeFilter(key)
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

  const handleSavePreset = async (name: string) => {
    const currentValues = formRef.current?.getValues()
    if (!currentValues) return

    try {
      await createPresetMutation.mutateAsync({
        name,
        searchParams: currentValues
      })
      toast.success(t("preset.saveSuccess"))
      setIsSavePresetDialogOpen(false)
    } catch (e) {
      if (e instanceof ServerError) {
        if (e.code === VIDEO_SEARCH_PRESET_ERROR_CODES.LIMIT_EXCEEDED) {
          toast.error(t("preset.limitExceeded"))
          return
        }
        if (e.code === VIDEO_SEARCH_PRESET_ERROR_CODES.DUPLICATE_NAME) {
          toast.error(t("preset.duplicateName"))
          return
        }
      }
      toast.error(t("preset.saveFailed"))
    }
  }

  const handleApplyPreset = (searchParamsRecord: Record<string, unknown>) => {
    formRef.current?.reset(searchParamsRecord)
  }

  const handleDeletePreset = async (presetId: string) => {
    try {
      await deletePresetMutation.mutateAsync({ presetId })
      toast.success(t("preset.deleteSuccess"))
    } catch {
      toast.error(t("preset.deleteFailed"))
    }
  }

  const filteredVideos = videosData
    ? videosData.items.filter((video) =>
        isWithinChannelAge(video.channelPublishedAt, channelAgeFilter)
      )
    : []

  const sortedVideos = sortVideos(filteredVideos, sortKey)

  return (
    <VideosPresentational
      videos={sortedVideos}
      totalVideoCount={videosData?.items.length ?? 0}
      categories={categoriesData?.items ?? []}
      isLoading={isVideosFetching}
      hasSearched={hasSearched}
      sortKey={sortKey}
      onSortChange={handleSortChange}
      channelAgeFilter={channelAgeFilter}
      onChannelAgeFilterChange={handleChannelAgeFilterChange}
      onSearch={handleSearch}
      hasNextPage={!!videosData?.nextPageToken}
      canGoPrevious={pageTokenHistory.length > 0}
      onNextPage={handleNextPage}
      onPreviousPage={handlePreviousPage}
      locale={locale}
      formRef={formRef}
      presets={presetsData?.presets ?? []}
      isSavePresetDialogOpen={isSavePresetDialogOpen}
      onOpenSavePresetDialog={() => setIsSavePresetDialogOpen(true)}
      onCloseSavePresetDialog={() => setIsSavePresetDialogOpen(false)}
      onSavePreset={handleSavePreset}
      isSavingPreset={createPresetMutation.isPending}
      onApplyPreset={handleApplyPreset}
      onDeletePreset={handleDeletePreset}
    />
  )
}
