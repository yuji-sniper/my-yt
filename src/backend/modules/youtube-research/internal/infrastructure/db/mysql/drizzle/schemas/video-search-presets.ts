import { sql } from "drizzle-orm"
import {
  index,
  json,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/mysql-core"

export const videoSearchPresets = mysqlTable(
  "video_search_presets",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    searchParams: json("search_params")
      .$type<Record<string, unknown>>()
      .notNull(),
    createdAt: timestamp("created_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdate(() => new Date())
  },
  (table) => [
    uniqueIndex("idx_video_search_presets_user_id_name").on(
      table.userId,
      table.name
    ),
    index("idx_video_search_presets_user_id").on(table.userId)
  ]
)
