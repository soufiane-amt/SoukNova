/*
  Warnings:

  - Made the column `primary_image` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "primary_image" SET NOT NULL;
