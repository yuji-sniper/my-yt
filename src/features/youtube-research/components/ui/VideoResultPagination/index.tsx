"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

type Props = {
  hasNextPage: boolean
  canGoPrevious: boolean
  onPrevious: () => void
  onNext: () => void
}

export function VideoResultPagination({
  hasNextPage,
  canGoPrevious,
  onPrevious,
  onNext
}: Props) {
  const t = useTranslations("youtubeResearch")

  if (!hasNextPage && !canGoPrevious) {
    return null
  }

  return (
    <div
      data-slot="video-result-pagination"
      className="flex items-center justify-center gap-4 pt-4"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={!canGoPrevious}
      >
        <ChevronLeft className="size-4" />
        {t("pagination.previous")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={!hasNextPage}
      >
        {t("pagination.next")}
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
