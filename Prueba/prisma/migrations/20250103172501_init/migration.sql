/*
  Warnings:

  - You are about to drop the column `academicPeriodId` on the `request` table. All the data in the column will be lost.
  - The values [aprobado,rechazado,prestado,devuelto] on the enum `Request_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `typeRequest` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `request` DROP FOREIGN KEY `Request_academicPeriodId_fkey`;

-- AlterTable
ALTER TABLE `request` DROP COLUMN `academicPeriodId`,
    ADD COLUMN `typeRequest` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('pendiente', 'prestamo', 'finalizado') NOT NULL DEFAULT 'pendiente';

-- CreateTable
CREATE TABLE `RequestPeriod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_id` INTEGER NOT NULL,
    `academic_period_id` INTEGER NOT NULL,
    `typeDate` VARCHAR(191) NOT NULL,
    `requestPeriodDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RequestPeriod` ADD CONSTRAINT `RequestPeriod_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `Request`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestPeriod` ADD CONSTRAINT `RequestPeriod_academic_period_id_fkey` FOREIGN KEY (`academic_period_id`) REFERENCES `AcademicPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
