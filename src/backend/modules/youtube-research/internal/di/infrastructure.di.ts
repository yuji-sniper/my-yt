import type { DependencyContainer } from "tsyringe"
import { YouTubeApiPortToken } from "@/backend/modules/youtube-research/internal/application/ports/youtube-api.port"
import { YouTubeCachePortToken } from "@/backend/modules/youtube-research/internal/application/ports/youtube-cache.port"
import { VideoCategoryRepositoryToken } from "@/backend/modules/youtube-research/internal/domain/video-category/video-category.repository"
import { YouTubeCacheAdapter } from "@/backend/modules/youtube-research/internal/infrastructure/cache/youtube-cache.adapter"
import { VideoCategoryMysqlDrizzleRepository } from "@/backend/modules/youtube-research/internal/infrastructure/db/mysql/drizzle/repositories/video-category.mysql-drizzle.repository"
import { YouTubeApiAdapter } from "@/backend/modules/youtube-research/internal/infrastructure/youtube-api/youtube-api.adapter"

export function initInfrastructureDependency(container: DependencyContainer) {
  container.registerSingleton(YouTubeApiPortToken, YouTubeApiAdapter)
  container.registerSingleton(YouTubeCachePortToken, YouTubeCacheAdapter)
  container.registerSingleton(
    VideoCategoryRepositoryToken,
    VideoCategoryMysqlDrizzleRepository
  )
}
