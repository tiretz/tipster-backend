-- CreateTable
CREATE TABLE "competitions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "year" DATE NOT NULL,

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userCompetitions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "competitionId" INTEGER NOT NULL,

    CONSTRAINT "userCompetitions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userCompetitions" ADD CONSTRAINT "userCompetitions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCompetitions" ADD CONSTRAINT "userCompetitions_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
