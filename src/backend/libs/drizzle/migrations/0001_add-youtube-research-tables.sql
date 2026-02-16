CREATE TABLE `youtube_search_cache` (
	`id` varchar(36) NOT NULL,
	`cache_key` varchar(64) NOT NULL,
	`search_type` varchar(20) NOT NULL,
	`response_data` json NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `youtube_search_cache_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_youtube_search_cache_cache_key` UNIQUE(`cache_key`)
);
--> statement-breakpoint
CREATE TABLE `youtube_video_categories` (
	`id` varchar(36) NOT NULL,
	`category_id` varchar(10) NOT NULL,
	`title` varchar(255) NOT NULL,
	`region_code` varchar(2) NOT NULL,
	`assignable` boolean NOT NULL,
	`fetched_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `youtube_video_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_youtube_video_categories_category_region` UNIQUE(`category_id`,`region_code`)
);
--> statement-breakpoint
CREATE INDEX `idx_youtube_search_cache_expires_at` ON `youtube_search_cache` (`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_youtube_video_categories_region_code` ON `youtube_video_categories` (`region_code`);