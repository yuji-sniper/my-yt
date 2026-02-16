import type { YouTubeVideo } from "@/backend/modules/youtube-research/internal/domain/youtube-api/youtube-api.types"

export class TrendingVideo {
  private constructor(
    public readonly videoId: string,
    public readonly title: string,
    public readonly thumbnailUrl: string,
    public readonly channelId: string,
    public readonly channelTitle: string,
    public readonly viewCount: number,
    public readonly likeCount: number,
    public readonly commentCount: number,
    public readonly duration: string,
    public readonly publishedAt: string,
    public readonly engagementRate: number
  ) {}

  static create(video: YouTubeVideo): TrendingVideo {
    const viewCount = Number(video.statistics.viewCount)
    const likeCount = Number(video.statistics.likeCount)
    const commentCount = Number(video.statistics.commentCount)

    const engagementRate =
      viewCount === 0 ? 0 : ((likeCount + commentCount) / viewCount) * 100

    return new TrendingVideo(
      video.id,
      video.snippet.title,
      video.snippet.thumbnails.medium.url,
      video.snippet.channelId,
      video.snippet.channelTitle,
      viewCount,
      likeCount,
      commentCount,
      video.contentDetails.duration,
      video.snippet.publishedAt,
      engagementRate
    )
  }
}
