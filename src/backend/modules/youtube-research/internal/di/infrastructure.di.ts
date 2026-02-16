import type { DependencyContainer } from "tsyringe"
import { YouTubeApiPortToken } from "@/backend/modules/youtube-research/internal/application/ports/youtube-api.port"
import { YouTubeCachePortToken } from "@/backend/modules/youtube-research/internal/application/ports/youtube-cache.port"
import { YouTubeCacheAdapter } from "@/backend/modules/youtube-research/internal/infrastructure/cache/youtube-cache.adapter"
import { YouTubeApiAdapter } from "@/backend/modules/youtube-research/internal/infrastructure/youtube-api/youtube-api.adapter"

export function initInfrastructureDependency(container: DependencyContainer) {
  container.registerSingleton(YouTubeApiPortToken, YouTubeApiAdapter)
  container.registerSingleton(YouTubeCachePortToken, YouTubeCacheAdapter)
}
