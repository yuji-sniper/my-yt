import { sql } from "drizzle-orm"
import {
  index,
  json,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/mysql-core"

export const youtubeSearchCache = mysqlTable(
  "youtube_search_cache",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    cacheKey: varchar("cache_key", { length: 64 }).notNull(),
    searchType: varchar("search_type", { length: 20 }).notNull(),
    responseData: json("response_data").$type<unknown>().notNull(),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
  },
  (table) => [
    uniqueIndex("idx_youtube_search_cache_cache_key").on(table.cacheKey),
    index("idx_youtube_search_cache_expires_at").on(table.expiresAt)
  ]
)
