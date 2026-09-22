CREATE TABLE `loan_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`requestedAmount` decimal(12,2) NOT NULL,
	`termMonths` int NOT NULL,
	`purpose` varchar(120) NOT NULL,
	`monthlyIncome` decimal(12,2) NOT NULL,
	`employmentStatus` varchar(80) NOT NULL,
	`status` enum('submitted','under_review','approved','declined') NOT NULL DEFAULT 'submitted',
	`decisionNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loan_applications_id` PRIMARY KEY(`id`)
);
