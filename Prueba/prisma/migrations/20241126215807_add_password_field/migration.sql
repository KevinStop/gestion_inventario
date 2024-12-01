-- AlterTable
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(255) NULL,
    MODIFY `google_id` VARCHAR(255) NULL;
