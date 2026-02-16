export interface YouTubeCachePort {
  get<T>(cacheKey: string): Promise<T | null>

  set(cacheKey: string, searchType: string, data: unknown): Promise<void>

  generateKey(params: Record<string, unknown>): string
}

export const YouTubeCachePortToken = Symbol("YouTubeCachePort")
