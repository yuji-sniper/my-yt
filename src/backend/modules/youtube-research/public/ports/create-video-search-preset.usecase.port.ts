export interface CreateVideoSearchPresetUseCasePortInput {
  name: string
  searchParams: Record<string, unknown>
}

export interface CreateVideoSearchPresetResultItem {
  id: string
  name: string
  searchParams: Record<string, unknown>
  createdAt: Date
}

export interface CreateVideoSearchPresetUseCasePortOutput {
  preset: CreateVideoSearchPresetResultItem
}

export interface CreateVideoSearchPresetUseCasePort {
  handle(
    input: CreateVideoSearchPresetUseCasePortInput
  ): Promise<CreateVideoSearchPresetUseCasePortOutput>
}

export const CreateVideoSearchPresetUseCasePortToken = Symbol(
  "CreateVideoSearchPresetUseCasePort"
)
