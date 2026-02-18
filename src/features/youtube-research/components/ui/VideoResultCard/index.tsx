"use client"

import {
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  ThumbsUp,
  Users
} from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { TrendingVideo } from "../../../types/trending-video"

type Props = {
  video: TrendingVideo
  locale: string
}

type ChannelAgeCategory =
  | "within1Month"
  | "within3Months"
  | "within6Months"
  | "within1Year"
  | null

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

function getChannelAgeCategory(channelPublishedAt: string): ChannelAgeCategory {
  if (!channelPublishedAt) return null

  const now = new Date()
  const published = new Date(channelPublishedAt)
  const diffMs = now.getTime() - published.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffDays <= 30) return "within1Month"
  if (diffDays <= 90) return "within3Months"
  if (diffDays <= 180) return "within6Months"
  if (diffDays <= 365) return "within1Year"
  return null
}

const channelAgeBadgeStyles: Record<
  Exclude<ChannelAgeCategory, null>,
  string
> = {
  within1Month: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  within3Months:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  within6Months:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  within1Year:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
}

export function VideoResultCard({ video, locale }: Props) {
  const t = useTranslations("youtubeResearch")
  const channelAge = getChannelAgeCategory(video.channelPublishedAt)

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

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{video.channelTitle}</span>
          <span className="flex shrink-0 items-center gap-1">
            <Users className="size-3" />
            {formatNumber(video.channelSubscriberCount, locale)}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(video.channelPublishedAt, locale)}
          </span>
          {channelAge && (
            <Badge
              variant="outline"
              className={`shrink-0 border-0 text-[10px] ${channelAgeBadgeStyles[channelAge]}`}
            >
              {t(`result.channelAge.${channelAge}`)}
            </Badge>
          )}
        </div>

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
