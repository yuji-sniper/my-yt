import { eq, sql } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import type {
  VideoCategoryRecord,
  VideoCategoryRepository,
  VideoCategoryUpsertInput
} from "@/backend/modules/youtube-research/internal/domain/video-category/video-category.repository"
import { youtubeVideoCategories } from "@/backend/modules/youtube-research/internal/infrastructure/db/mysql/drizzle/schemas"

@injectable()
export class VideoCategoryMysqlDrizzleRepository
  implements VideoCategoryRepository
{
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findByRegionCode(regionCode: string): Promise<VideoCategoryRecord[]> {
    const db = this.getDb.handle()
    const rows = await db
      .select()
      .from(youtubeVideoCategories)
      .where(eq(youtubeVideoCategories.regionCode, regionCode))

    return rows.map((row) => ({
      categoryId: row.categoryId,
      title: row.title,
      regionCode: row.regionCode,
      assignable: row.assignable,
      fetchedAt: row.fetchedAt
    }))
  }

  async upsertMany(categories: VideoCategoryUpsertInput[]): Promise<void> {
    if (categories.length === 0) {
      return
    }

    const db = this.getDb.handle()
    const values = categories.map((category) => ({
      id: category.id,
      categoryId: category.categoryId,
      title: category.title,
      regionCode: category.regionCode,
      assignable: category.assignable,
      fetchedAt: category.fetchedAt
    }))

    await db
      .insert(youtubeVideoCategories)
      .values(values)
      .onDuplicateKeyUpdate({
        set: {
          title: sql`VALUES(${youtubeVideoCategories.title})`,
          assignable: sql`VALUES(${youtubeVideoCategories.assignable})`,
          fetchedAt: sql`VALUES(${youtubeVideoCategories.fetchedAt})`
        }
      })
  }
}
