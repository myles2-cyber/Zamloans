CREATE TABLE `swiftwallet_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`applicationId` int NOT NULL,
	`amountUsd` decimal(12,2) NOT NULL,
	`amountKes` int NOT NULL,
	`phoneNumber` varchar(32) NOT NULL,
	`externalReference` varchar(120) NOT NULL,
	`swiftTransactionId` varchar(120),
	`status` enum('initiated','completed','failed','cancelled') NOT NULL DEFAULT 'initiated',
	`rawStatus` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `swiftwallet_payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `swiftwallet_payments_externalReference_unique` UNIQUE(`externalReference`)
);
--> statement-breakpoint
ALTER TABLE `loan_applications` ADD `approvedFeeUsd` decimal(12,2);