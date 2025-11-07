/*
  Warnings:

  - You are about to drop the column `userId` on the `CartItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_userId_fkey";

-- DropIndex
DROP INDEX "CartItem_userId_productId_key";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "userId";
