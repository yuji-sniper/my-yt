"use client"

import { Clock, Eye, MessageSquare, ThumbsUp } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { TrendingVideo } from "../../../types/trending-video"

type Props = {
  video: TrendingVideo
  locale: string
}

function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return isoDuration

  const hours = match[1] ? Number.parseInt(match[1], 10) : 0
  const minutes = match[2] ? Number.parseInt(match[2], 10) : 0
  const seconds = match[3] ? Number.parseInt(match[3], 10) : 0

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

function formatNumber(num: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(num)
}

function formatDate(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(dateStr))
}

export function VideoResultCard({ video, locale }: Props) {
  const t = useTranslations("youtubeResearch")

  return (
    <div
      data-slot="video-result-card"
      className="flex gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
    >
      <a
        href={`https://www.youtube.com/watch?v=${video.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative shrink-0 overflow-hidden rounded-md"
      >
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          width={168}
          height={94}
          className="size-auto object-cover"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-xs text-white">
          {formatDuration(video.duration)}
        </span>
      </a>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 text-sm font-medium hover:text-primary"
        >
          {video.title}
        </a>

        <p className="truncate text-xs text-muted-foreground">
          {video.channelTitle}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {formatNumber(video.viewCount, locale)}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="size-3.5" />
            {formatNumber(video.likeCount, locale)}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3.5" />
            {formatNumber(video.commentCount, locale)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDate(video.publishedAt, locale)}
          </span>
          <Badge variant="secondary" className="text-xs">
            {t("result.engagementRate")}: {video.engagementRate.toFixed(2)}%
          </Badge>
        </div>
      </div>
    </div>
  )
}
