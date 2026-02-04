-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "notifyNewUsers" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOrders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyReviews" BOOLEAN NOT NULL DEFAULT false;
