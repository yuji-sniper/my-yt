import type {
  YouTubeChannel,
  YouTubeChannelSearchParams,
  YouTubeSearchListResponse,
  YouTubeVideo,
  YouTubeVideoCategory,
  YouTubeVideoSearchParams
} from "@/backend/modules/youtube-research/internal/domain/youtube-api/youtube-api.types"

export interface YouTubeApiPort {
  searchVideos(
    params: YouTubeVideoSearchParams
  ): Promise<YouTubeSearchListResponse>

  searchChannels(
    params: YouTubeChannelSearchParams
  ): Promise<YouTubeSearchListResponse>

  getVideos(videoIds: string[]): Promise<YouTubeVideo[]>

  getChannels(channelIds: string[]): Promise<YouTubeChannel[]>

  getVideoCategories(regionCode: string): Promise<YouTubeVideoCategory[]>
}

export const YouTubeApiPortToken = Symbol("YouTubeApiPort")
