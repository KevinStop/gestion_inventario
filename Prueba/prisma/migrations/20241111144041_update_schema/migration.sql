/*
  Warnings:

  - You are about to alter the column `status` on the `loan` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(2))`.
  - You are about to alter the column `status` on the `request` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `loan` MODIFY `status` ENUM('devuelto', 'no_devuelto') NOT NULL DEFAULT 'devuelto';

-- AlterTable
ALTER TABLE `request` MODIFY `status` ENUM('pendiente', 'aprobado', 'rechazado', 'prestado', 'devuelto') NOT NULL DEFAULT 'pendiente';
