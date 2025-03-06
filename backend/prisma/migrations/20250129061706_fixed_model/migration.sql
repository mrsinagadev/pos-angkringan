/*
  Warnings:

  - You are about to drop the column `name` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `kategoriId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `fisrtName` on the `supplier` table. All the data in the column will be lost.
  - Added the required column `kategoryName` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kategoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_kategoriId_fkey`;

-- DropIndex
DROP INDEX `Category_name_key` ON `category`;

-- DropIndex
DROP INDEX `Product_kategoriId_fkey` ON `product`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `name`,
    ADD COLUMN `kategoryName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `kategoriId`,
    DROP COLUMN `updateAt`,
    ADD COLUMN `kategoryId` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `supplier` DROP COLUMN `fisrtName`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_kategoryId_fkey` FOREIGN KEY (`kategoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
