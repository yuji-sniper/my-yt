import { inject, injectable } from "tsyringe"
import type { YouTubeApiPort } from "@/backend/modules/youtube-research/internal/application/ports/youtube-api.port"
import { YouTubeApiPortToken } from "@/backend/modules/youtube-research/internal/application/ports/youtube-api.port"
import type { YouTubeCachePort } from "@/backend/modules/youtube-research/internal/application/ports/youtube-cache.port"
import { YouTubeCachePortToken } from "@/backend/modules/youtube-research/internal/application/ports/youtube-cache.port"
import { GrowingChannel } from "@/backend/modules/youtube-research/internal/domain/growing-channel/growing-channel"
import type {
  SearchGrowingChannelsUseCasePort,
  SearchGrowingChannelsUseCasePortInput,
  SearchGrowingChannelsUseCasePortOutput
} from "@/backend/modules/youtube-research/public/ports/search-growing-channels.usecase.port"

const SEARCH_LIST_QUOTA = 100
const CHANNELS_LIST_QUOTA = 1

@injectable()
export class SearchGrowingChannelsUseCase
  implements SearchGrowingChannelsUseCasePort
{
  constructor(
    @inject(YouTubeApiPortToken)
    private readonly youtubeApi: YouTubeApiPort,
    @inject(YouTubeCachePortToken)
    private readonly cache: YouTubeCachePort
  ) {}

  async handle(
    input: SearchGrowingChannelsUseCasePortInput
  ): Promise<SearchGrowingChannelsUseCasePortOutput> {
    // 1. キャッシュキー生成
    const cacheKey = this.cache.generateKey({
      type: "growing-channel",
      keyword: input.keyword,
      publishedAfter: input.publishedAfter,
      publishedBefore: input.publishedBefore,
      regionCode: input.regionCode,
      relevanceLanguage: input.relevanceLanguage,
      order: input.order,
      pageToken: input.pageToken
    })

    // 2. キャッシュ確認
    const cached =
      await this.cache.get<SearchGrowingChannelsUseCasePortOutput>(cacheKey)
    if (cached) {
      return cached
    }

    // 3. search.list で channelId 一覧取得
    const searchResponse = await this.youtubeApi.searchChannels({
      q: input.keyword,
      publishedAfter: input.publishedAfter,
      publishedBefore: input.publishedBefore,
      regionCode: input.regionCode,
      relevanceLanguage: input.relevanceLanguage,
      pageToken: input.pageToken,
      order: input.order,
      maxResults: 50
    })

    const channelIds = searchResponse.items
      .map((item) => item.id.channelId)
      .filter((id): id is string => id !== undefined)

    if (channelIds.length === 0) {
      const emptyResult: SearchGrowingChannelsUseCasePortOutput = {
        items: [],
        nextPageToken: searchResponse.nextPageToken,
        totalResults: searchResponse.pageInfo.totalResults,
        quotaUsed: SEARCH_LIST_QUOTA
      }
      await this.cache.set(cacheKey, "growing-channel", emptyResult)
      return emptyResult
    }

    // 4. channels.list でチャンネル詳細・統計を一括取得
    const channels = await this.youtubeApi.getChannels(channelIds)

    // 5. GrowingChannel ドメインモデル生成
    const growingChannels = channels.map((channel) =>
      GrowingChannel.create(channel)
    )

    // 6. DTO に変換
    const result: SearchGrowingChannelsUseCasePortOutput = {
      items: growingChannels.map((gc) => ({
        channelId: gc.channelId,
        title: gc.title,
        description: gc.description,
        thumbnailUrl: gc.thumbnailUrl,
        customUrl: gc.customUrl,
        subscriberCount: gc.subscriberCount,
        viewCount: gc.viewCount,
        videoCount: gc.videoCount,
        publishedAt: gc.publishedAt,
        daysSinceCreation: gc.daysSinceCreation,
        growthSpeed: gc.growthSpeed
      })),
      nextPageToken: searchResponse.nextPageToken,
      totalResults: searchResponse.pageInfo.totalResults,
      quotaUsed: SEARCH_LIST_QUOTA + CHANNELS_LIST_QUOTA
    }

    // 7. キャッシュに保存
    await this.cache.set(cacheKey, "growing-channel", result)

    return result
  }
}
