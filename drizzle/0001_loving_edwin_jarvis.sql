CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('channel','movie','series') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `channels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`categoryId` int NOT NULL,
	`streamUrl` text NOT NULL,
	`icon` text,
	`quality` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `channels_id` PRIMARY KEY(`id`),
	CONSTRAINT `channels_externalId_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `epgData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channelId` int NOT NULL,
	`startTime` varchar(10) NOT NULL,
	`endTime` varchar(10) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `epgData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `episodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(64) NOT NULL,
	`seriesId` int NOT NULL,
	`season` int NOT NULL,
	`episode` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`streamUrl` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `episodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `episodes_externalId_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `movies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`year` int,
	`genres` text NOT NULL,
	`duration` varchar(20),
	`imdbRating` int,
	`description` text,
	`posterUrl` text,
	`categoryId` int NOT NULL,
	`streamUrl` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `movies_id` PRIMARY KEY(`id`),
	CONSTRAINT `movies_externalId_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `series` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`genres` text NOT NULL,
	`imdbRating` int,
	`description` text,
	`posterUrl` text,
	`categoryId` int NOT NULL,
	`totalSeasons` int NOT NULL DEFAULT 1,
	`totalEpisodes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `series_id` PRIMARY KEY(`id`),
	CONSTRAINT `series_externalId_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `userFavorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contentType` enum('channel','movie','series') NOT NULL,
	`contentId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userFavorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contentType` enum('channel','movie','episode') NOT NULL,
	`contentId` int NOT NULL,
	`watchedAt` timestamp NOT NULL DEFAULT (now()),
	`progress` int DEFAULT 0,
	CONSTRAINT `userHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userWatchlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contentType` enum('movie','series') NOT NULL,
	`contentId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userWatchlist_id` PRIMARY KEY(`id`)
);
