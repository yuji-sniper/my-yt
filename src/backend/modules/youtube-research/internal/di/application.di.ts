import type { DependencyContainer } from "tsyringe"
import { GetVideoCategoriesUseCase } from "@/backend/modules/youtube-research/internal/application/queries/usecases/get-video-categories/get-video-categories.usecase"
import { SearchGrowingChannelsUseCase } from "@/backend/modules/youtube-research/internal/application/queries/usecases/search-growing-channels/search-growing-channels.usecase"
import { SearchTrendingVideosUseCase } from "@/backend/modules/youtube-research/internal/application/queries/usecases/search-trending-videos/search-trending-videos.usecase"
import { GetVideoCategoriesUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/get-video-categories.usecase.port"
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
  container.registerSingleton(
    GetVideoCategoriesUseCasePortToken,
    GetVideoCategoriesUseCase
  )
}
