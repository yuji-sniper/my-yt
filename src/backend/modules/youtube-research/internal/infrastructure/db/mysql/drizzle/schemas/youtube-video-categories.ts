import { sql } from "drizzle-orm"
import {
  boolean,
  index,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/mysql-core"

export const youtubeVideoCategories = mysqlTable(
  "youtube_video_categories",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    categoryId: varchar("category_id", { length: 10 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    regionCode: varchar("region_code", { length: 2 }).notNull(),
    assignable: boolean("assignable").notNull(),
    fetchedAt: timestamp("fetched_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
  },
  (table) => [
    uniqueIndex("idx_youtube_video_categories_category_region").on(
      table.categoryId,
      table.regionCode
    ),
    index("idx_youtube_video_categories_region_code").on(table.regionCode)
  ]
)
