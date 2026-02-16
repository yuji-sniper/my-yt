import type { YouTubeChannel } from "@/backend/modules/youtube-research/internal/domain/youtube-api/youtube-api.types"

export class GrowingChannel {
  private constructor(
    public readonly channelId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly thumbnailUrl: string,
    public readonly customUrl: string | undefined,
    public readonly subscriberCount: number,
    public readonly viewCount: number,
    public readonly videoCount: number,
    public readonly publishedAt: string,
    public readonly daysSinceCreation: number,
    public readonly growthSpeed: number | null
  ) {}

  static create(channel: YouTubeChannel): GrowingChannel {
    const subscriberCount = Number(channel.statistics.subscriberCount)
    const viewCount = Number(channel.statistics.viewCount)
    const videoCount = Number(channel.statistics.videoCount)

    const publishedDate = new Date(channel.snippet.publishedAt)
    const now = new Date()
    const daysSinceCreation = Math.max(
      1,
      Math.floor(
        (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    )

    const growthSpeed = channel.statistics.hiddenSubscriberCount
      ? null
      : subscriberCount / daysSinceCreation

    return new GrowingChannel(
      channel.id,
      channel.snippet.title,
      channel.snippet.description,
      channel.snippet.thumbnails.medium.url,
      channel.snippet.customUrl,
      subscriberCount,
      viewCount,
      videoCount,
      channel.snippet.publishedAt,
      daysSinceCreation,
      growthSpeed
    )
  }
}
