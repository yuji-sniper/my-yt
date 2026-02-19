import type { VideoSearchPreset } from "./video-search-preset"

export const VideoSearchPresetRepositoryToken = Symbol(
  "VideoSearchPresetRepository"
)

export interface VideoSearchPresetRepository {
  findById(id: string): Promise<VideoSearchPreset | null>
  findByUserId(userId: string): Promise<VideoSearchPreset[]>
  findByUserIdAndName(
    userId: string,
    name: string
  ): Promise<VideoSearchPreset | null>
  countByUserId(userId: string): Promise<number>
  save(preset: VideoSearchPreset): Promise<void>
  delete(id: string): Promise<void>
}
