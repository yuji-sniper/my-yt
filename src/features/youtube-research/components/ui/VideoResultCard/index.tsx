"use client"

import { Check, Copy } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import type {
  ChannelAgeRange,
  TrendingVideo
} from "../../../types/trending-video"
import { getChannelAgeRange } from "../../../utils/channel-age"

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

const channelAgeBadgeStyles: Record<Exclude<ChannelAgeRange, null>, string> = {
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
  const channelAge = getChannelAgeRange(video.channelPublishedAt)
  const [copied, setCopied] = useState(false)

  const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(videoUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      data-slot="video-result-card"
      className="group relative flex gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
    >
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 rounded-md p-1.5 text-muted-foreground cursor-pointer hover:bg-accent hover:text-foreground"
        title={t("result.copyLink")}
      >
        {copied ? (
          <Check className="size-4 text-green-500" />
        ) : (
          <Copy className="size-4" />
        )}
      </button>

      <a
        href={videoUrl}
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
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 text-sm font-medium hover:text-primary"
        >
          {video.title}
        </a>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{video.channelTitle}</span>
          <span className="shrink-0">
            {t("result.subscriberCount")}:{" "}
            {formatNumber(video.channelSubscriberCount, locale)}
          </span>
          <span className="shrink-0">
            {t("result.channelCreated")}:{" "}
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
          <span>
            {t("result.viewCount")}: {formatNumber(video.viewCount, locale)}
          </span>
          <span>
            {t("result.likeCount")}: {formatNumber(video.likeCount, locale)}
          </span>
          <span>
            {t("result.commentCount")}:{" "}
            {formatNumber(video.commentCount, locale)}
          </span>
          <span>
            {t("result.publishedAt")}: {formatDate(video.publishedAt, locale)}
          </span>
          <Badge variant="secondary" className="text-xs">
            {t("result.engagementRate")}:{" "}
            {(video.engagementRate ?? 0).toFixed(2)}%
          </Badge>
        </div>
      </div>
    </div>
  )
}
