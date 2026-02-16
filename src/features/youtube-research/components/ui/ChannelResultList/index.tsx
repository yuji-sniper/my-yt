"use client"

import { useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import type { GrowingChannel } from "../../../types/growing-channel"
import { ChannelResultCard } from "../ChannelResultCard"

type Props = {
  channels: GrowingChannel[]
  isLoading: boolean
  hasSearched: boolean
  locale: string
}

export function ChannelResultList({
  channels,
  isLoading,
  hasSearched,
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
        <p className="text-sm">{t("channelResult.empty.initial")}</p>
      </div>
    )
  }

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
        <p className="text-sm">{t("channelResult.empty.noResults")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {channels.map((channel) => (
        <ChannelResultCard
          key={channel.channelId}
          channel={channel}
          locale={locale}
        />
      ))}
    </div>
  )
}
