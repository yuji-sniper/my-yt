CREATE TABLE `video_search_presets` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`search_params` json NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `video_search_presets_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_video_search_presets_user_id_name` UNIQUE(`user_id`,`name`)
);
--> statement-breakpoint
CREATE INDEX `idx_video_search_presets_user_id` ON `video_search_presets` (`user_id`);