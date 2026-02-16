import type { DependencyContainer } from "tsyringe"
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
}
