/*
  Warnings:

  - The primary key for the `userCompetitions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `userCompetitions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "userCompetitions" DROP CONSTRAINT "userCompetitions_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "userCompetitions_pkey" PRIMARY KEY ("userId", "competitionId");
