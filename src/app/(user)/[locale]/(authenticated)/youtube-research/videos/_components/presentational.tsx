"use client"

import { Bookmark } from "lucide-react"
import { useTranslations } from "next-intl"
import type { Ref } from "react"
import { Button } from "@/components/ui/button"
import { SaveVideoSearchPresetDialog } from "@/features/youtube-research/components/ui/SaveVideoSearchPresetDialog"
import { VideoResultList } from "@/features/youtube-research/components/ui/VideoResultList"
import { VideoResultPagination } from "@/features/youtube-research/components/ui/VideoResultPagination"
import {
  VideoSearchForm,
  type VideoSearchFormRef
} from "@/features/youtube-research/components/ui/VideoSearchForm"
import { VideoSearchPresetList } from "@/features/youtube-research/components/ui/VideoSearchPresetList"
import type {
  ChannelAgeFilterKey,
  SearchTrendingVideosParams,
  SortKey,
  TrendingVideo
} from "@/features/youtube-research/types/trending-video"
import type { VideoCategory } from "@/features/youtube-research/types/video-category"
import type { VideoSearchPreset } from "@/features/youtube-research/types/video-search-preset"

type Props = {
  videos: TrendingVideo[]
  totalVideoCount: number
  categories: VideoCategory[]
  isLoading: boolean
  hasSearched: boolean
  sortKey: SortKey
  onSortChange: (key: SortKey) => void
  channelAgeFilter: ChannelAgeFilterKey
  onChannelAgeFilterChange: (key: ChannelAgeFilterKey) => void
  onSearch: (params: SearchTrendingVideosParams) => void
  hasNextPage: boolean
  canGoPrevious: boolean
  onNextPage: () => void
  onPreviousPage: () => void
  locale: string
  formRef: Ref<VideoSearchFormRef>
  presets: VideoSearchPreset[]
  isSavePresetDialogOpen: boolean
  onOpenSavePresetDialog: () => void
  onCloseSavePresetDialog: () => void
  onSavePreset: (name: string) => void
  isSavingPreset: boolean
  onApplyPreset: (searchParams: Record<string, unknown>) => void
  onDeletePreset: (presetId: string) => void
}

export function VideosPresentational({
  videos,
  totalVideoCount,
  categories,
  isLoading,
  hasSearched,
  sortKey,
  onSortChange,
  channelAgeFilter,
  onChannelAgeFilterChange,
  onSearch,
  hasNextPage,
  canGoPrevious,
  onNextPage,
  onPreviousPage,
  locale,
  formRef,
  presets,
  isSavePresetDialogOpen,
  onOpenSavePresetDialog,
  onCloseSavePresetDialog,
  onSavePreset,
  isSavingPreset,
  onApplyPreset,
  onDeletePreset
}: Props) {
  const t = useTranslations("youtubeResearch")

  return (
    <div className="flex flex-col gap-6">
      <VideoSearchPresetList
        presets={presets}
        onApply={onApplyPreset}
        onDelete={onDeletePreset}
      />

      <VideoSearchForm
        categories={categories}
        onSearch={onSearch}
        isSearching={isLoading}
        formRef={formRef}
      />

      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenSavePresetDialog}
        >
          <Bookmark className="size-4" />
          {t("preset.save")}
        </Button>
      </div>

      <SaveVideoSearchPresetDialog
        open={isSavePresetDialogOpen}
        onOpenChange={(open) => {
          if (!open) onCloseSavePresetDialog()
        }}
        onSave={onSavePreset}
        isSaving={isSavingPreset}
      />

      <VideoResultList
        videos={videos}
        totalVideoCount={totalVideoCount}
        isLoading={isLoading}
        hasSearched={hasSearched}
        sortKey={sortKey}
        onSortChange={onSortChange}
        channelAgeFilter={channelAgeFilter}
        onChannelAgeFilterChange={onChannelAgeFilterChange}
        locale={locale}
      />

      {hasSearched && !isLoading && videos.length > 0 && (
        <VideoResultPagination
          hasNextPage={hasNextPage}
          canGoPrevious={canGoPrevious}
          onPrevious={onPreviousPage}
          onNext={onNextPage}
        />
      )}
    </div>
  )
}
