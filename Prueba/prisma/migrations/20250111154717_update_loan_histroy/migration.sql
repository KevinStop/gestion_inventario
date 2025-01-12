-- AlterTable
ALTER TABLE `loanhistory` ADD COLUMN `finalStatus` VARCHAR(191) NULL,
    ADD COLUMN `statusHistory` JSON NULL,
    ADD COLUMN `wasReturned` BOOLEAN NOT NULL DEFAULT true;
