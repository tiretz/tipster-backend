/*
  Warnings:

  - Added the required column `country` to the `competitions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "info" TEXT;
