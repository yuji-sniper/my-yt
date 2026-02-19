import { inject, injectable } from "tsyringe"
import type { GetCurrentUserPort } from "@/backend/modules/youtube-research/internal/application/ports/get-current-user.port"
import { GetCurrentUserPortToken } from "@/backend/modules/youtube-research/internal/application/ports/get-current-user.port"
import type { VideoSearchPresetRepository } from "@/backend/modules/youtube-research/internal/domain/video-search-preset/video-search-preset.repository"
import { VideoSearchPresetRepositoryToken } from "@/backend/modules/youtube-research/internal/domain/video-search-preset/video-search-preset.repository"
import { VideoSearchPresetNotFoundError } from "@/backend/modules/youtube-research/public/errors/video-search-preset.errors"
import type {
  DeleteVideoSearchPresetUseCasePort,
  DeleteVideoSearchPresetUseCasePortInput
} from "@/backend/modules/youtube-research/public/ports/delete-video-search-preset.usecase.port"

@injectable()
export class DeleteVideoSearchPresetUseCase
  implements DeleteVideoSearchPresetUseCasePort
{
  constructor(
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(VideoSearchPresetRepositoryToken)
    private readonly videoSearchPresetRepository: VideoSearchPresetRepository
  ) {}

  async handle(input: DeleteVideoSearchPresetUseCasePortInput): Promise<void> {
    const { userId } = await this.getCurrentUser.handle()

    const preset = await this.videoSearchPresetRepository.findById(
      input.presetId
    )

    if (!preset || preset.userId !== userId) {
      throw new VideoSearchPresetNotFoundError()
    }

    await this.videoSearchPresetRepository.delete(preset.id)
  }
}
