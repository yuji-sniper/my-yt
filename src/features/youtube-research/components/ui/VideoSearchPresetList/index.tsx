"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { VideoSearchPreset } from "../../../types/video-search-preset"

type Props = {
  presets: VideoSearchPreset[]
  onApply: (searchParams: Record<string, unknown>) => void
  onDelete: (presetId: string) => void
}

export function VideoSearchPresetList({ presets, onApply, onDelete }: Props) {
  if (presets.length === 0) {
    return null
  }

  return (
    <div data-slot="video-search-preset-list" className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <div key={preset.id} className="flex items-center">
          <Badge
            variant="secondary"
            className="cursor-pointer select-none hover:bg-secondary/80"
            onClick={() => onApply(preset.searchParams)}
          >
            {preset.name}
          </Badge>
          <button
            type="button"
            className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(preset.id)}
            aria-label={`Delete ${preset.name}`}
          >
            <X className="size-3 cursor-pointer" />
          </button>
        </div>
      ))}
    </div>
  )
}
