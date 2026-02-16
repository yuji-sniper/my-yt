import { injectable } from "tsyringe"
import type { YouTubeApiPort } from "@/backend/modules/youtube-research/internal/application/ports/youtube-api.port"
import type {
  YouTubeChannel,
  YouTubeChannelListResponse,
  YouTubeChannelSearchParams,
  YouTubeSearchListResponse,
  YouTubeVideo,
  YouTubeVideoCategory,
  YouTubeVideoCategoryListResponse,
  YouTubeVideoListResponse,
  YouTubeVideoSearchParams
} from "@/backend/modules/youtube-research/internal/domain/youtube-api/youtube-api.types"
import { YouTubeApiRequestFailedError } from "@/backend/modules/youtube-research/public/errors/youtube-research.errors"
import { env } from "@/env"

const BASE_URL = "https://www.googleapis.com/youtube/v3"
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY_MS = 1000
const MIN_REQUEST_INTERVAL_MS = 100

@injectable()
export class YouTubeApiAdapter implements YouTubeApiPort {
  private lastRequestTime = 0

  async searchVideos(
    params: YouTubeVideoSearchParams
  ): Promise<YouTubeSearchListResponse> {
    const query = new URLSearchParams({
      part: "snippet",
      type: "video",
      maxResults: String(params.maxResults ?? 50),
      publishedAfter: params.publishedAfter
    })

    if (params.q) query.set("q", params.q)
    if (params.publishedBefore)
      query.set("publishedBefore", params.publishedBefore)
    if (params.regionCode) query.set("regionCode", params.regionCode)
    if (params.relevanceLanguage)
      query.set("relevanceLanguage", params.relevanceLanguage)
    if (params.videoCategoryId)
      query.set("videoCategoryId", params.videoCategoryId)
    if (params.videoDuration && params.videoDuration !== "any")
      query.set("videoDuration", params.videoDuration)
    if (params.pageToken) query.set("pageToken", params.pageToken)
    if (params.order) query.set("order", params.order)

    return this.request<YouTubeSearchListResponse>("/search", query)
  }

  async searchChannels(
    params: YouTubeChannelSearchParams
  ): Promise<YouTubeSearchListResponse> {
    const query = new URLSearchParams({
      part: "snippet",
      type: "channel",
      maxResults: String(params.maxResults ?? 50)
    })

    if (params.q) query.set("q", params.q)
    if (params.publishedAfter)
      query.set("publishedAfter", params.publishedAfter)
    if (params.publishedBefore)
      query.set("publishedBefore", params.publishedBefore)
    if (params.regionCode) query.set("regionCode", params.regionCode)
    if (params.relevanceLanguage)
      query.set("relevanceLanguage", params.relevanceLanguage)
    if (params.pageToken) query.set("pageToken", params.pageToken)
    if (params.order) query.set("order", params.order)

    return this.request<YouTubeSearchListResponse>("/search", query)
  }

  async getVideos(videoIds: string[]): Promise<YouTubeVideo[]> {
    if (videoIds.length === 0) return []

    const query = new URLSearchParams({
      part: "snippet,statistics,contentDetails",
      id: videoIds.join(","),
      maxResults: String(videoIds.length)
    })

    const response = await this.request<YouTubeVideoListResponse>(
      "/videos",
      query
    )
    return response.items
  }

  async getChannels(channelIds: string[]): Promise<YouTubeChannel[]> {
    if (channelIds.length === 0) return []

    const query = new URLSearchParams({
      part: "snippet,statistics",
      id: channelIds.join(","),
      maxResults: String(channelIds.length)
    })

    const response = await this.request<YouTubeChannelListResponse>(
      "/channels",
      query
    )
    return response.items
  }

  async getVideoCategories(
    regionCode: string
  ): Promise<YouTubeVideoCategory[]> {
    const query = new URLSearchParams({
      part: "snippet",
      regionCode
    })

    const response = await this.request<YouTubeVideoCategoryListResponse>(
      "/videoCategories",
      query
    )
    return response.items
  }

  private async request<T>(path: string, query: URLSearchParams): Promise<T> {
    query.set("key", env.YOUTUBE_API_KEY)
    const url = `${BASE_URL}${path}?${query.toString()}`

    await this.waitForRateLimit()

    let lastError: Error | null = null

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url)
        this.lastRequestTime = Date.now()

        if (!response.ok) {
          const body = await response.text()
          throw new YouTubeApiRequestFailedError(
            `YouTube API returned ${response.status}: ${body}`
          )
        }

        return (await response.json()) as T
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        if (error instanceof YouTubeApiRequestFailedError) {
          // 4xx エラーはリトライしない（403クォータ超過含む）
          throw error
        }

        // ネットワークエラーなどはリトライ
        if (attempt < MAX_RETRIES - 1) {
          const delay = INITIAL_RETRY_DELAY_MS * 2 ** attempt
          await this.sleep(delay)
        }
      }
    }

    throw new YouTubeApiRequestFailedError(
      lastError?.message ?? "YouTube API request failed after retries"
    )
  }

  private async waitForRateLimit(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestTime
    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
      await this.sleep(MIN_REQUEST_INTERVAL_MS - elapsed)
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
