import { inject, injectable } from "tsyringe"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import type { YouTubeApiPort } from "@/backend/modules/youtube-research/internal/application/ports/youtube-api.port"
import { YouTubeApiPortToken } from "@/backend/modules/youtube-research/internal/application/ports/youtube-api.port"
import type { VideoCategoryRepository } from "@/backend/modules/youtube-research/internal/domain/video-category/video-category.repository"
import { VideoCategoryRepositoryToken } from "@/backend/modules/youtube-research/internal/domain/video-category/video-category.repository"
import type {
  GetVideoCategoriesUseCasePort,
  GetVideoCategoriesUseCasePortOutput
} from "@/backend/modules/youtube-research/public/ports/get-video-categories.usecase.port"

const REGION_CODE_JP = "JP"
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

@injectable()
export class GetVideoCategoriesUseCase
  implements GetVideoCategoriesUseCasePort
{
  constructor(
    @inject(YouTubeApiPortToken)
    private readonly youtubeApi: YouTubeApiPort,
    @inject(VideoCategoryRepositoryToken)
    private readonly videoCategoryRepository: VideoCategoryRepository,
    @inject(UuidV7GeneratorPortToken)
    private readonly uuidV7Generator: UuidV7GeneratorPort
  ) {}

  async handle(): Promise<GetVideoCategoriesUseCasePortOutput> {
    // 1. DB からキャッシュ検索
    const cached =
      await this.videoCategoryRepository.findByRegionCode(REGION_CODE_JP)

    // 2. キャッシュヒット判定（レコードが存在し fetchedAt が24時間以内）
    if (cached.length > 0) {
      const fetchedAt = cached[0].fetchedAt
      const now = new Date()
      if (now.getTime() - fetchedAt.getTime() < CACHE_TTL_MS) {
        return {
          items: cached
            .filter((row) => row.assignable)
            .map((row) => ({
              categoryId: row.categoryId,
              title: row.title
            }))
        }
      }
    }

    // 3. YouTube API からカテゴリ取得
    const apiCategories =
      await this.youtubeApi.getVideoCategories(REGION_CODE_JP)

    // 4. DB に upsert
    const now = new Date()
    await this.videoCategoryRepository.upsertMany(
      apiCategories.map((category) => ({
        id: this.uuidV7Generator.generate(),
        categoryId: category.id,
        title: category.snippet.title,
        regionCode: REGION_CODE_JP,
        assignable: category.snippet.assignable,
        fetchedAt: now
      }))
    )

    // 5. assignable: true のカテゴリのみ返却
    return {
      items: apiCategories
        .filter((category) => category.snippet.assignable)
        .map((category) => ({
          categoryId: category.id,
          title: category.snippet.title
        }))
    }
  }
}
