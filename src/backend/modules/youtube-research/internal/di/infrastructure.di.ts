import type { DependencyContainer } from "tsyringe"
import { GetCurrentUserPortToken } from "@/backend/modules/youtube-research/internal/application/ports/get-current-user.port"
import { YouTubeApiPortToken } from "@/backend/modules/youtube-research/internal/application/ports/youtube-api.port"
import { YouTubeCachePortToken } from "@/backend/modules/youtube-research/internal/application/ports/youtube-cache.port"
import { VideoCategoryRepositoryToken } from "@/backend/modules/youtube-research/internal/domain/video-category/video-category.repository"
import { VideoSearchPresetRepositoryToken } from "@/backend/modules/youtube-research/internal/domain/video-search-preset/video-search-preset.repository"
import { YouTubeCacheAdapter } from "@/backend/modules/youtube-research/internal/infrastructure/cache/youtube-cache.adapter"
import { VideoCategoryMysqlDrizzleRepository } from "@/backend/modules/youtube-research/internal/infrastructure/db/mysql/drizzle/repositories/video-category.mysql-drizzle.repository"
import { VideoSearchPresetMysqlDrizzleRepository } from "@/backend/modules/youtube-research/internal/infrastructure/db/mysql/drizzle/repositories/video-search-preset.mysql-drizzle.repository"
import { GetCurrentUserAuthModuleAdapter } from "@/backend/modules/youtube-research/internal/infrastructure/modules/auth/get-current-user.auth-module.adapter"
import { YouTubeApiAdapter } from "@/backend/modules/youtube-research/internal/infrastructure/youtube-api/youtube-api.adapter"

export function initInfrastructureDependency(container: DependencyContainer) {
  container.registerSingleton(YouTubeApiPortToken, YouTubeApiAdapter)
  container.registerSingleton(YouTubeCachePortToken, YouTubeCacheAdapter)
  container.registerSingleton(
    VideoCategoryRepositoryToken,
    VideoCategoryMysqlDrizzleRepository
  )

  // Repositories
  container.registerSingleton(
    VideoSearchPresetRepositoryToken,
    VideoSearchPresetMysqlDrizzleRepository
  )

  // External Module Adapters
  container.registerSingleton(
    GetCurrentUserPortToken,
    GetCurrentUserAuthModuleAdapter
  )
}
