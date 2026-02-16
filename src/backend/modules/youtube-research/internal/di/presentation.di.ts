import type { DependencyContainer } from "tsyringe"
import {
  SearchTrendingVideosHandlerImpl,
  SearchTrendingVideosHandlerToken
} from "@/backend/modules/youtube-research/internal/presentation/handlers/search-trending-videos/search-trending-videos.handler"

export function initPresentationDependency(container: DependencyContainer) {
  container.registerSingleton(
    SearchTrendingVideosHandlerToken,
    SearchTrendingVideosHandlerImpl
  )
}
