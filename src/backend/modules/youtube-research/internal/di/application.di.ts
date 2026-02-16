import type { DependencyContainer } from "tsyringe"
import { SearchGrowingChannelsUseCase } from "@/backend/modules/youtube-research/internal/application/queries/usecases/search-growing-channels/search-growing-channels.usecase"
import { SearchTrendingVideosUseCase } from "@/backend/modules/youtube-research/internal/application/queries/usecases/search-trending-videos/search-trending-videos.usecase"
import { SearchGrowingChannelsUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/search-growing-channels.usecase.port"
import { SearchTrendingVideosUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/search-trending-videos.usecase.port"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(
    SearchTrendingVideosUseCasePortToken,
    SearchTrendingVideosUseCase
  )
  container.registerSingleton(
    SearchGrowingChannelsUseCasePortToken,
    SearchGrowingChannelsUseCase
  )
}
