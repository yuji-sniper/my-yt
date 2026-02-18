import { inject, injectable } from "tsyringe"
import type { YouTubeApiPort } from "@/backend/modules/youtube-research/internal/application/ports/youtube-api.port"
import { YouTubeApiPortToken } from "@/backend/modules/youtube-research/internal/application/ports/youtube-api.port"
import type { YouTubeCachePort } from "@/backend/modules/youtube-research/internal/application/ports/youtube-cache.port"
import { YouTubeCachePortToken } from "@/backend/modules/youtube-research/internal/application/ports/youtube-cache.port"
import { TrendingVideo } from "@/backend/modules/youtube-research/internal/domain/trending-video/trending-video"
import type {
  SearchTrendingVideosUseCasePort,
  SearchTrendingVideosUseCasePortInput,
  SearchTrendingVideosUseCasePortOutput
} from "@/backend/modules/youtube-research/public/ports/search-trending-videos.usecase.port"

const SEARCH_LIST_QUOTA = 100
const VIDEOS_LIST_QUOTA = 1
const CHANNELS_LIST_QUOTA = 1

@injectable()
export class SearchTrendingVideosUseCase
  implements SearchTrendingVideosUseCasePort
{
  constructor(
    @inject(YouTubeApiPortToken)
    private readonly youtubeApi: YouTubeApiPort,
    @inject(YouTubeCachePortToken)
    private readonly cache: YouTubeCachePort
  ) {}

  async handle(
    input: SearchTrendingVideosUseCasePortInput
  ): Promise<SearchTrendingVideosUseCasePortOutput> {
    // 1. キャッシュキー生成
    const cacheKey = this.cache.generateKey({
      type: "trending-video",
      keyword: input.keyword,
      categoryId: input.categoryId,
      publishedAfter: input.publishedAfter,
      publishedBefore: input.publishedBefore,
      regionCode: input.regionCode,
      relevanceLanguage: input.relevanceLanguage,
      videoDuration: input.videoDuration,
      order: input.order,
      pageToken: input.pageToken
    })

    // 2. キャッシュ確認
    const cached =
      await this.cache.get<SearchTrendingVideosUseCasePortOutput>(cacheKey)
    if (cached) {
      return cached
    }

    // 3. search.list で videoId 一覧取得
    const searchResponse = await this.youtubeApi.searchVideos({
      q: input.keyword,
      videoCategoryId: input.categoryId,
      publishedAfter: input.publishedAfter,
      publishedBefore: input.publishedBefore,
      regionCode: input.regionCode,
      relevanceLanguage: input.relevanceLanguage,
      videoDuration: input.videoDuration,
      order: input.order,
      pageToken: input.pageToken,
      maxResults: 50
    })

    const videoIds = searchResponse.items
      .map((item) => item.id.videoId)
      .filter((id): id is string => id !== undefined)

    if (videoIds.length === 0) {
      const emptyResult: SearchTrendingVideosUseCasePortOutput = {
        items: [],
        nextPageToken: searchResponse.nextPageToken,
        totalResults: searchResponse.pageInfo.totalResults,
        quotaUsed: SEARCH_LIST_QUOTA
      }
      await this.cache.set(cacheKey, "trending-video", emptyResult)
      return emptyResult
    }

    // 4. videos.list で統計情報を一括取得
    const videos = await this.youtubeApi.getVideos(videoIds)

    // 5. channels.list でチャンネル情報を一括取得
    const channelIds = [...new Set(videos.map((v) => v.snippet.channelId))]
    const channels = await this.youtubeApi.getChannels(channelIds)
    const channelMap = new Map(
      channels.map((ch) => [
        ch.id,
        {
          publishedAt: ch.snippet.publishedAt,
          subscriberCount: Number(ch.statistics.subscriberCount)
        }
      ])
    )

    // 6. TrendingVideo ドメインモデル生成
    const trendingVideos = videos.map((video) =>
      TrendingVideo.create(
        video,
        channelMap.get(video.snippet.channelId) ?? {
          publishedAt: "",
          subscriberCount: 0
        }
      )
    )

    // 7. DTO に変換
    const result: SearchTrendingVideosUseCasePortOutput = {
      items: trendingVideos.map((tv) => ({
        videoId: tv.videoId,
        title: tv.title,
        thumbnailUrl: tv.thumbnailUrl,
        channelId: tv.channelId,
        channelTitle: tv.channelTitle,
        viewCount: tv.viewCount,
        likeCount: tv.likeCount,
        commentCount: tv.commentCount,
        duration: tv.duration,
        publishedAt: tv.publishedAt,
        engagementRate: tv.engagementRate,
        channelPublishedAt: tv.channelPublishedAt,
        channelSubscriberCount: tv.channelSubscriberCount
      })),
      nextPageToken: searchResponse.nextPageToken,
      totalResults: searchResponse.pageInfo.totalResults,
      quotaUsed: SEARCH_LIST_QUOTA + VIDEOS_LIST_QUOTA + CHANNELS_LIST_QUOTA
    }

    // 8. キャッシュに保存
    await this.cache.set(cacheKey, "trending-video", result)

    return result
  }
}
