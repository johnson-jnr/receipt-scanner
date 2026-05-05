ALTER TABLE `expenses` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `expenses` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `items` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `items` DROP COLUMN `createdAt`;