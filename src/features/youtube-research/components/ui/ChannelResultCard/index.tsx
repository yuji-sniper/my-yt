"use client"

import { Calendar, Eye, Film, TrendingUp, Users } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { GrowingChannel } from "../../../types/growing-channel"

type Props = {
  channel: GrowingChannel
  locale: string
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

function getChannelUrl(channel: GrowingChannel): string {
  if (channel.customUrl) {
    return `https://www.youtube.com/${channel.customUrl}`
  }
  return `https://www.youtube.com/channel/${channel.channelId}`
}

function truncateDescription(description: string, maxLength: number): string {
  if (description.length <= maxLength) return description
  return `${description.slice(0, maxLength)}...`
}

export function ChannelResultCard({ channel, locale }: Props) {
  const t = useTranslations("youtubeResearch")

  return (
    <div
      data-slot="channel-result-card"
      className="flex gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
    >
      <a
        href={getChannelUrl(channel)}
        target="_blank"
        rel="noopener noreferrer"
        className="relative shrink-0 overflow-hidden rounded-full"
      >
        <Image
          src={channel.thumbnailUrl}
          alt={channel.title}
          width={64}
          height={64}
          className="size-16 rounded-full object-cover"
        />
      </a>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <a
          href={getChannelUrl(channel)}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-sm font-medium hover:text-primary"
        >
          {channel.title}
        </a>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {truncateDescription(channel.description, 100)}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {formatNumber(channel.subscriberCount, locale)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {formatNumber(channel.viewCount, locale)}
          </span>
          <span className="flex items-center gap-1">
            <Film className="size-3.5" />
            {formatNumber(channel.videoCount, locale)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {formatDate(channel.publishedAt, locale)}
          </span>
          <span className="text-xs text-muted-foreground">
            (
            {t("channelResult.daysSinceCreation", {
              days: channel.daysSinceCreation
            })}
            )
          </span>
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="mr-1 size-3" />
            {`${channel.growthSpeed.toFixed(1)} ${t("channelResult.growthSpeedUnit")}`}
          </Badge>
        </div>
      </div>
    </div>
  )
}
