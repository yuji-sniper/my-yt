export interface DeleteVideoSearchPresetUseCasePortInput {
  presetId: string
}

export interface DeleteVideoSearchPresetUseCasePort {
  handle(input: DeleteVideoSearchPresetUseCasePortInput): Promise<void>
}

export const DeleteVideoSearchPresetUseCasePortToken = Symbol(
  "DeleteVideoSearchPresetUseCasePort"
)
