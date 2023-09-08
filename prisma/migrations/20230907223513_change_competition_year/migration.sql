/*
  Warnings:

  - You are about to drop the column `year` on the `competitions` table. All the data in the column will be lost.
  - Added the required column `date` to the `competitions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "competitions" DROP COLUMN "year",
ADD COLUMN     "date" DATE NOT NULL;
