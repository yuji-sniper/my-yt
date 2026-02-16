"use client"

import { ChannelResultList } from "@/features/youtube-research/components/ui/ChannelResultList"
import { ChannelResultPagination } from "@/features/youtube-research/components/ui/ChannelResultPagination"
import { ChannelSearchForm } from "@/features/youtube-research/components/ui/ChannelSearchForm"
import type {
  ChannelSortKey,
  GrowingChannel,
  SearchGrowingChannelsParams
} from "@/features/youtube-research/types/growing-channel"

type Props = {
  channels: GrowingChannel[]
  isLoading: boolean
  hasSearched: boolean
  sortKey: ChannelSortKey
  onSortChange: (key: ChannelSortKey) => void
  onSearch: (params: SearchGrowingChannelsParams) => void
  hasNextPage: boolean
  canGoPrevious: boolean
  onNextPage: () => void
  onPreviousPage: () => void
  locale: string
}

export function ChannelsPresentational({
  channels,
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
      <ChannelSearchForm onSearch={onSearch} isSearching={isLoading} />

      <ChannelResultList
        channels={channels}
        isLoading={isLoading}
        hasSearched={hasSearched}
        sortKey={sortKey}
        onSortChange={onSortChange}
        locale={locale}
      />

      {hasSearched && !isLoading && channels.length > 0 && (
        <ChannelResultPagination
          hasNextPage={hasNextPage}
          canGoPrevious={canGoPrevious}
          onPrevious={onPreviousPage}
          onNext={onNextPage}
        />
      )}
    </div>
  )
}
