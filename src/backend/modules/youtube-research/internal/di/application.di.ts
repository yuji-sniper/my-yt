import type { DependencyContainer } from "tsyringe"
import { CreateVideoSearchPresetUseCase } from "@/backend/modules/youtube-research/internal/application/commands/usecases/create-video-search-preset/create-video-search-preset.usecase"
import { DeleteVideoSearchPresetUseCase } from "@/backend/modules/youtube-research/internal/application/commands/usecases/delete-video-search-preset/delete-video-search-preset.usecase"
import { GetVideoCategoriesUseCase } from "@/backend/modules/youtube-research/internal/application/queries/usecases/get-video-categories/get-video-categories.usecase"
import { GetVideoSearchPresetsUseCase } from "@/backend/modules/youtube-research/internal/application/queries/usecases/get-video-search-presets/get-video-search-presets.usecase"
import { SearchGrowingChannelsUseCase } from "@/backend/modules/youtube-research/internal/application/queries/usecases/search-growing-channels/search-growing-channels.usecase"
import { SearchTrendingVideosUseCase } from "@/backend/modules/youtube-research/internal/application/queries/usecases/search-trending-videos/search-trending-videos.usecase"
import { CreateVideoSearchPresetUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/create-video-search-preset.usecase.port"
import { DeleteVideoSearchPresetUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/delete-video-search-preset.usecase.port"
import { GetVideoCategoriesUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/get-video-categories.usecase.port"
import { GetVideoSearchPresetsUseCasePortToken } from "@/backend/modules/youtube-research/public/ports/get-video-search-presets.usecase.port"
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
  container.registerSingleton(
    CreateVideoSearchPresetUseCasePortToken,
    CreateVideoSearchPresetUseCase
  )
  container.registerSingleton(
    GetVideoSearchPresetsUseCasePortToken,
    GetVideoSearchPresetsUseCase
  )
  container.registerSingleton(
    DeleteVideoSearchPresetUseCasePortToken,
    DeleteVideoSearchPresetUseCase
  )
}
