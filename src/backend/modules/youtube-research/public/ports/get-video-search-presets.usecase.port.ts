export interface GetVideoSearchPresetsResultItem {
  id: string
  name: string
  searchParams: Record<string, unknown>
  createdAt: Date
}

export interface GetVideoSearchPresetsUseCasePortOutput {
  presets: GetVideoSearchPresetsResultItem[]
}

export interface GetVideoSearchPresetsUseCasePort {
  handle(): Promise<GetVideoSearchPresetsUseCasePortOutput>
}

export const GetVideoSearchPresetsUseCasePortToken = Symbol(
  "GetVideoSearchPresetsUseCasePort"
)
