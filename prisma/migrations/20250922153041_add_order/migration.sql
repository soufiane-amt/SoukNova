-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
