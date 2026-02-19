import type { DependencyContainer } from "tsyringe"
import {
  CreateVideoSearchPresetHandlerImpl,
  CreateVideoSearchPresetHandlerToken
} from "@/backend/modules/youtube-research/internal/presentation/handlers/create-video-search-preset/create-video-search-preset.handler"
import {
  DeleteVideoSearchPresetHandlerImpl,
  DeleteVideoSearchPresetHandlerToken
} from "@/backend/modules/youtube-research/internal/presentation/handlers/delete-video-search-preset/delete-video-search-preset.handler"
import {
  GetVideoCategoriesHandlerImpl,
  GetVideoCategoriesHandlerToken
} from "@/backend/modules/youtube-research/internal/presentation/handlers/get-video-categories/get-video-categories.handler"
import {
  GetVideoSearchPresetsHandlerImpl,
  GetVideoSearchPresetsHandlerToken
} from "@/backend/modules/youtube-research/internal/presentation/handlers/get-video-search-presets/get-video-search-presets.handler"
import {
  SearchGrowingChannelsHandlerImpl,
  SearchGrowingChannelsHandlerToken
} from "@/backend/modules/youtube-research/internal/presentation/handlers/search-growing-channels/search-growing-channels.handler"
import {
  SearchTrendingVideosHandlerImpl,
  SearchTrendingVideosHandlerToken
} from "@/backend/modules/youtube-research/internal/presentation/handlers/search-trending-videos/search-trending-videos.handler"

export function initPresentationDependency(container: DependencyContainer) {
  container.registerSingleton(
    SearchTrendingVideosHandlerToken,
    SearchTrendingVideosHandlerImpl
  )
  container.registerSingleton(
    SearchGrowingChannelsHandlerToken,
    SearchGrowingChannelsHandlerImpl
  )
  container.registerSingleton(
    GetVideoCategoriesHandlerToken,
    GetVideoCategoriesHandlerImpl
  )
  container.registerSingleton(
    CreateVideoSearchPresetHandlerToken,
    CreateVideoSearchPresetHandlerImpl
  )
  container.registerSingleton(
    GetVideoSearchPresetsHandlerToken,
    GetVideoSearchPresetsHandlerImpl
  )
  container.registerSingleton(
    DeleteVideoSearchPresetHandlerToken,
    DeleteVideoSearchPresetHandlerImpl
  )
}
