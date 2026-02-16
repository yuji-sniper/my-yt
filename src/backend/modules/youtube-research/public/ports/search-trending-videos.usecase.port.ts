import type {
  SearchTrendingVideosParams,
  SearchTrendingVideosResult
} from "@/backend/modules/youtube-research/internal/application/ports/search-trending-videos.port"

export type SearchTrendingVideosUseCasePortInput = SearchTrendingVideosParams

export type SearchTrendingVideosUseCasePortOutput = SearchTrendingVideosResult

export interface SearchTrendingVideosUseCasePort {
  handle(
    input: SearchTrendingVideosUseCasePortInput
  ): Promise<SearchTrendingVideosUseCasePortOutput>
}

export const SearchTrendingVideosUseCasePortToken = Symbol(
  "SearchTrendingVideosUseCasePort"
)
