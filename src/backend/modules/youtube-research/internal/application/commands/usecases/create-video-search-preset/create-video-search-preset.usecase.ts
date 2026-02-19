import { inject, injectable } from "tsyringe"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import type { GetCurrentUserPort } from "@/backend/modules/youtube-research/internal/application/ports/get-current-user.port"
import { GetCurrentUserPortToken } from "@/backend/modules/youtube-research/internal/application/ports/get-current-user.port"
import { VideoSearchPreset } from "@/backend/modules/youtube-research/internal/domain/video-search-preset/video-search-preset"
import type { VideoSearchPresetRepository } from "@/backend/modules/youtube-research/internal/domain/video-search-preset/video-search-preset.repository"
import { VideoSearchPresetRepositoryToken } from "@/backend/modules/youtube-research/internal/domain/video-search-preset/video-search-preset.repository"
import {
  VideoSearchPresetDuplicateNameError,
  VideoSearchPresetLimitExceededError
} from "@/backend/modules/youtube-research/public/errors/video-search-preset.errors"
import type {
  CreateVideoSearchPresetUseCasePort,
  CreateVideoSearchPresetUseCasePortInput,
  CreateVideoSearchPresetUseCasePortOutput
} from "@/backend/modules/youtube-research/public/ports/create-video-search-preset.usecase.port"

const MAX_PRESETS_PER_USER = 20

@injectable()
export class CreateVideoSearchPresetUseCase
  implements CreateVideoSearchPresetUseCasePort
{
  constructor(
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(VideoSearchPresetRepositoryToken)
    private readonly videoSearchPresetRepository: VideoSearchPresetRepository,
    @inject(UuidV7GeneratorPortToken)
    private readonly uuidV7Generator: UuidV7GeneratorPort
  ) {}

  async handle(
    input: CreateVideoSearchPresetUseCasePortInput
  ): Promise<CreateVideoSearchPresetUseCasePortOutput> {
    const { userId } = await this.getCurrentUser.handle()

    const count = await this.videoSearchPresetRepository.countByUserId(userId)
    if (count >= MAX_PRESETS_PER_USER) {
      throw new VideoSearchPresetLimitExceededError()
    }

    const existing = await this.videoSearchPresetRepository.findByUserIdAndName(
      userId,
      input.name
    )
    if (existing) {
      throw new VideoSearchPresetDuplicateNameError()
    }

    const preset = VideoSearchPreset.create({
      id: this.uuidV7Generator.generate(),
      userId,
      name: input.name,
      searchParams: input.searchParams
    })

    await this.videoSearchPresetRepository.save(preset)

    return {
      preset: {
        id: preset.id,
        name: preset.name,
        searchParams: preset.searchParams,
        createdAt: preset.createdAt
      }
    }
  }
}
