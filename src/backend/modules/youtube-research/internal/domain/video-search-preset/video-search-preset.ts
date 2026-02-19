export class VideoSearchPreset {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public readonly searchParams: Record<string, unknown>,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(params: {
    id: string
    userId: string
    name: string
    searchParams: Record<string, unknown>
  }): VideoSearchPreset {
    const now = new Date()
    return new VideoSearchPreset(
      params.id,
      params.userId,
      params.name,
      params.searchParams,
      now,
      now
    )
  }

  static reconstruct(params: {
    id: string
    userId: string
    name: string
    searchParams: Record<string, unknown>
    createdAt: Date
    updatedAt: Date
  }): VideoSearchPreset {
    return new VideoSearchPreset(
      params.id,
      params.userId,
      params.name,
      params.searchParams,
      params.createdAt,
      params.updatedAt
    )
  }

  updateName(name: string): void {
    this.name = name
    this.updatedAt = new Date()
  }
}
