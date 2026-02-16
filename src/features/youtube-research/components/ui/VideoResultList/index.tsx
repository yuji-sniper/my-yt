"use client"

import { ArrowDownUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/shadcn/utils"
import type { SortKey, TrendingVideo } from "../../../types/trending-video"
import { VideoResultCard } from "../VideoResultCard"

type Props = {
  videos: TrendingVideo[]
  isLoading: boolean
  hasSearched: boolean
  sortKey: SortKey
  onSortChange: (key: SortKey) => void
  locale: string
}

const SORT_OPTIONS: SortKey[] = ["viewCount", "engagementRate", "publishedAt"]

export function VideoResultList({
  videos,
  isLoading,
  hasSearched,
  sortKey,
  onSortChange,
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

  if (videos.length === 0) {
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

      <div className="flex flex-col gap-3">
        {videos.map((video) => (
          <VideoResultCard key={video.videoId} video={video} locale={locale} />
        ))}
      </div>
    </div>
  )
}
