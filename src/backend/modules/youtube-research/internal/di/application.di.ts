import type { DependencyContainer } from "tsyringe"
import { SearchTrendingVideosUseCase } from "@/backend/modules/youtube-research/internal/application/queries/usecases/search-trending-videos/search-trending-videos.usecase"
import { SearchTrendingVideosUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/search-trending-videos.usecase.port"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(
    SearchTrendingVideosUseCasePortToken,
    SearchTrendingVideosUseCase
  )
}
