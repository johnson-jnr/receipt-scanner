CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `expenses` ADD `user_id` integer NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `expenses` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `items` DROP COLUMN `deleted_at`;