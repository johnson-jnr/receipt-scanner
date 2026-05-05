CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`merchant` text,
	`address` text,
	`total` real,
	`category` text,
	`date` text,
	`time` text,
	`updated_at` integer,
	`createdAt` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`expense_id` integer NOT NULL,
	`name` text NOT NULL,
	`price` real,
	`quantity` integer,
	`updated_at` integer,
	`createdAt` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE no action
);
