CREATE TABLE `inboxes` (
	`id` text PRIMARY KEY NOT NULL,
	`address` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`expires_at` integer NOT NULL,
	`last_accessed` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inboxes_address_unique` ON `inboxes` (`address`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`inbox_id` text NOT NULL,
	`sender` text NOT NULL,
	`recipient` text NOT NULL,
	`subject` text,
	`text` text,
	`html` text,
	`attachments` text,
	`headers` text,
	`size` integer DEFAULT 0 NOT NULL,
	`received_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`inbox_id`) REFERENCES `inboxes`(`id`) ON UPDATE no action ON DELETE cascade
);
