import { createHash } from "node:crypto"
import { and, eq, gt } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import type { YouTubeCachePort } from "@/backend/modules/youtube-research/internal/application/ports/youtube-cache.port"
import { youtubeSearchCache } from "@/backend/modules/youtube-research/internal/infrastructure/db/mysql/drizzle/schemas"

const CACHE_TTL_HOURS = 6

@injectable()
export class YouTubeCacheAdapter implements YouTubeCachePort {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb,
    @inject(UuidV7GeneratorPortToken)
    private readonly uuidV7Generator: UuidV7GeneratorPort
  ) {}

  async get<T>(cacheKey: string): Promise<T | null> {
    const db = this.getDb.handle()
    const now = new Date()

    const result = await db
      .select()
      .from(youtubeSearchCache)
      .where(
        and(
          eq(youtubeSearchCache.cacheKey, cacheKey),
          gt(youtubeSearchCache.expiresAt, now)
        )
      )
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return result[0].responseData as T
  }

  async set(
    cacheKey: string,
    searchType: string,
    data: unknown
  ): Promise<void> {
    const db = this.getDb.handle()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000)

    await db
      .insert(youtubeSearchCache)
      .values({
        id: this.uuidV7Generator.generate(),
        cacheKey,
        searchType,
        responseData: data,
        expiresAt,
        createdAt: now
      })
      .onDuplicateKeyUpdate({
        set: {
          responseData: data,
          expiresAt,
          createdAt: now
        }
      })
  }

  generateKey(params: Record<string, unknown>): string {
    const sorted = Object.keys(params)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        if (params[key] !== undefined && params[key] !== null) {
          acc[key] = params[key]
        }
        return acc
      }, {})

    const json = JSON.stringify(sorted)
    return createHash("sha256").update(json).digest("hex")
  }
}
