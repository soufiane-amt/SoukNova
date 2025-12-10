-- CreateTable
CREATE TABLE "article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "images" TEXT[],
    "text" TEXT NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);
