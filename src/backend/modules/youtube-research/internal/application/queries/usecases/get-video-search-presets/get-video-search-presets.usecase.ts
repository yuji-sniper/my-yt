import { inject, injectable } from "tsyringe"
import type { GetCurrentUserPort } from "@/backend/modules/youtube-research/internal/application/ports/get-current-user.port"
import { GetCurrentUserPortToken } from "@/backend/modules/youtube-research/internal/application/ports/get-current-user.port"
import type { VideoSearchPresetRepository } from "@/backend/modules/youtube-research/internal/domain/video-search-preset/video-search-preset.repository"
import { VideoSearchPresetRepositoryToken } from "@/backend/modules/youtube-research/internal/domain/video-search-preset/video-search-preset.repository"
import type {
  GetVideoSearchPresetsUseCasePort,
  GetVideoSearchPresetsUseCasePortOutput
} from "@/backend/modules/youtube-research/public/ports/get-video-search-presets.usecase.port"

@injectable()
export class GetVideoSearchPresetsUseCase
  implements GetVideoSearchPresetsUseCasePort
{
  constructor(
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(VideoSearchPresetRepositoryToken)
    private readonly videoSearchPresetRepository: VideoSearchPresetRepository
  ) {}

  async handle(): Promise<GetVideoSearchPresetsUseCasePortOutput> {
    const { userId } = await this.getCurrentUser.handle()

    const presets = await this.videoSearchPresetRepository.findByUserId(userId)

    return {
      presets: presets.map((preset) => ({
        id: preset.id,
        name: preset.name,
        searchParams: preset.searchParams,
        createdAt: preset.createdAt
      }))
    }
  }
}
