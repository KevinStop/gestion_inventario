/*
  Warnings:

  - The primary key for the `component` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `component` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `component` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `component` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `component` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `component` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Component` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `loan` DROP FOREIGN KEY `Loan_component_id_fkey`;

-- DropForeignKey
ALTER TABLE `requestdetail` DROP FOREIGN KEY `RequestDetail_component_id_fkey`;

-- AlterTable
ALTER TABLE `component` DROP PRIMARY KEY,
    DROP COLUMN `ID`,
    DROP COLUMN `category`,
    DROP COLUMN `created_at`,
    DROP COLUMN `is_active`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Component` ADD CONSTRAINT `Component_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestDetail` ADD CONSTRAINT `RequestDetail_component_id_fkey` FOREIGN KEY (`component_id`) REFERENCES `Component`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_component_id_fkey` FOREIGN KEY (`component_id`) REFERENCES `Component`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
