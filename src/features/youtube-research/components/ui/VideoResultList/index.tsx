"use client"

import { ArrowDownUp, Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/shadcn/utils"
import {
  CHANNEL_AGE_FILTER_KEYS,
  type ChannelAgeFilterKey,
  type SortKey,
  type TrendingVideo,
  VIDEO_SORT_KEYS
} from "../../../types/trending-video"
import { VideoResultCard } from "../VideoResultCard"

type Props = {
  videos: TrendingVideo[]
  totalVideoCount: number
  isLoading: boolean
  hasSearched: boolean
  sortKey: SortKey
  onSortChange: (key: SortKey) => void
  channelAgeFilter: ChannelAgeFilterKey
  onChannelAgeFilterChange: (key: ChannelAgeFilterKey) => void
  locale: string
}

const SORT_OPTIONS = Object.values(VIDEO_SORT_KEYS)
const CHANNEL_AGE_FILTER_OPTIONS = Object.values(CHANNEL_AGE_FILTER_KEYS)

export function VideoResultList({
  videos,
  totalVideoCount,
  isLoading,
  hasSearched,
  sortKey,
  onSortChange,
  channelAgeFilter,
  onChannelAgeFilterChange,
  locale
}: Props) {
  const t = useTranslations("youtubeResearch")

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 固定長のスケルトンUIのため順序変更なし
          <Skeleton key={`skeleton-${i}`} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
        <p className="text-sm">{t("result.empty.initial")}</p>
      </div>
    )
  }

  if (totalVideoCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
        <p className="text-sm">{t("result.empty.noResults")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <ArrowDownUp className="size-4 text-muted-foreground" />
        <div className="flex gap-1">
          {SORT_OPTIONS.map((key) => (
            <Button
              key={key}
              variant={sortKey === key ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onSortChange(key)}
              className={cn("text-xs", sortKey === key && "font-medium")}
            >
              {t(`result.sort.${key}`)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="size-4 text-muted-foreground" />
        <div className="flex gap-1">
          {CHANNEL_AGE_FILTER_OPTIONS.map((key) => (
            <Button
              key={key}
              variant={channelAgeFilter === key ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onChannelAgeFilterChange(key)}
              className={cn(
                "text-xs",
                channelAgeFilter === key && "font-medium"
              )}
            >
              {key === "all"
                ? t("result.channelAgeFilter.all")
                : t(`result.channelAge.${key}`)}
            </Button>
          ))}
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
          <p className="text-sm">{t("result.empty.noResults")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {videos.map((video) => (
            <VideoResultCard
              key={video.videoId}
              video={video}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  )
}
