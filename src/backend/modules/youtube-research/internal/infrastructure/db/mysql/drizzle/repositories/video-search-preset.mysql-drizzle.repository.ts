import { and, desc, eq, sql } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { VideoSearchPreset } from "@/backend/modules/youtube-research/internal/domain/video-search-preset/video-search-preset"
import type { VideoSearchPresetRepository } from "@/backend/modules/youtube-research/internal/domain/video-search-preset/video-search-preset.repository"
import { videoSearchPresets } from "@/backend/modules/youtube-research/internal/infrastructure/db/mysql/drizzle/schemas"
import { VideoSearchPresetDuplicateNameError } from "@/backend/modules/youtube-research/public/errors/video-search-preset.errors"

@injectable()
export class VideoSearchPresetMysqlDrizzleRepository
  implements VideoSearchPresetRepository
{
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findById(id: string): Promise<VideoSearchPreset | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(videoSearchPresets)
      .where(eq(videoSearchPresets.id, id))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return VideoSearchPreset.reconstruct({
      id: result[0].id,
      userId: result[0].userId,
      name: result[0].name,
      searchParams: result[0].searchParams,
      createdAt: result[0].createdAt,
      updatedAt: result[0].updatedAt
    })
  }

  async findByUserId(userId: string): Promise<VideoSearchPreset[]> {
    const db = this.getDb.handle()
    const rows = await db
      .select()
      .from(videoSearchPresets)
      .where(eq(videoSearchPresets.userId, userId))
      .orderBy(desc(videoSearchPresets.createdAt))

    return rows.map((row) =>
      VideoSearchPreset.reconstruct({
        id: row.id,
        userId: row.userId,
        name: row.name,
        searchParams: row.searchParams,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      })
    )
  }

  async findByUserIdAndName(
    userId: string,
    name: string
  ): Promise<VideoSearchPreset | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(videoSearchPresets)
      .where(
        and(
          eq(videoSearchPresets.userId, userId),
          eq(videoSearchPresets.name, name)
        )
      )
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return VideoSearchPreset.reconstruct({
      id: result[0].id,
      userId: result[0].userId,
      name: result[0].name,
      searchParams: result[0].searchParams,
      createdAt: result[0].createdAt,
      updatedAt: result[0].updatedAt
    })
  }

  async countByUserId(userId: string): Promise<number> {
    const db = this.getDb.handle()
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(videoSearchPresets)
      .where(eq(videoSearchPresets.userId, userId))

    return result[0].count
  }

  async save(preset: VideoSearchPreset): Promise<void> {
    const db = this.getDb.handle()
    try {
      await db.insert(videoSearchPresets).values({
        id: preset.id,
        userId: preset.userId,
        name: preset.name,
        searchParams: preset.searchParams,
        createdAt: preset.createdAt,
        updatedAt: preset.updatedAt
      })
    } catch (e: unknown) {
      if (this.isDuplicateEntryError(e)) {
        throw new VideoSearchPresetDuplicateNameError()
      }
      throw e
    }
  }

  async delete(id: string): Promise<void> {
    const db = this.getDb.handle()
    await db.delete(videoSearchPresets).where(eq(videoSearchPresets.id, id))
  }

  private isDuplicateEntryError(error: unknown): boolean {
    return (
      error != null &&
      typeof error === "object" &&
      "errno" in error &&
      error.errno === 1062
    )
  }
}
