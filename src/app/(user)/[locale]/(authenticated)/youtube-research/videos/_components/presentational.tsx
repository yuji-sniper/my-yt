"use client"

import { VideoResultList } from "@/features/youtube-research/components/ui/VideoResultList"
import { VideoResultPagination } from "@/features/youtube-research/components/ui/VideoResultPagination"
import { VideoSearchForm } from "@/features/youtube-research/components/ui/VideoSearchForm"
import type {
  SearchTrendingVideosParams,
  SortKey,
  TrendingVideo
} from "@/features/youtube-research/types/trending-video"
import type { VideoCategory } from "@/features/youtube-research/types/video-category"

type Props = {
  videos: TrendingVideo[]
  categories: VideoCategory[]
  isLoading: boolean
  hasSearched: boolean
  sortKey: SortKey
  onSortChange: (key: SortKey) => void
  onSearch: (params: SearchTrendingVideosParams) => void
  hasNextPage: boolean
  canGoPrevious: boolean
  onNextPage: () => void
  onPreviousPage: () => void
  locale: string
}

export function VideosPresentational({
  videos,
  categories,
  isLoading,
  hasSearched,
  sortKey,
  onSortChange,
  onSearch,
  hasNextPage,
  canGoPrevious,
  onNextPage,
  onPreviousPage,
  locale
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <VideoSearchForm
        categories={categories}
        onSearch={onSearch}
        isSearching={isLoading}
      />

      <VideoResultList
        videos={videos}
        isLoading={isLoading}
        hasSearched={hasSearched}
        sortKey={sortKey}
        onSortChange={onSortChange}
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
