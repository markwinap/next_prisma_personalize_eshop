-- CreateTable
CREATE TABLE "Yatch" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "Yatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "voyageType" TEXT NOT NULL,
    "voyageRegion" TEXT NOT NULL,
    "voyageStartDate" TIMESTAMP(3) NOT NULL,
    "voyageEndDate" TIMESTAMP(3) NOT NULL,
    "voyageEmbarkPort" TEXT NOT NULL,
    "voyageDisembarkPort" TEXT NOT NULL,
    "embarkationCountry" TEXT NOT NULL,
    "disEmbarkationCountry" TEXT NOT NULL,
    "nights" INTEGER NOT NULL,
    "startingPrice" DOUBLE PRECISION NOT NULL,
    "ports" TEXT[],
    "yatchId" TEXT NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dinning" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "cusineType" TEXT NOT NULL,
    "reservationRequired" BOOLEAN NOT NULL,
    "bar" BOOLEAN NOT NULL,
    "breakfast" BOOLEAN NOT NULL,
    "lunch" BOOLEAN NOT NULL,
    "dinner" BOOLEAN NOT NULL,
    "yatchId" TEXT NOT NULL,

    CONSTRAINT "Dinning_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_yatchId_fkey" FOREIGN KEY ("yatchId") REFERENCES "Yatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dinning" ADD CONSTRAINT "Dinning_yatchId_fkey" FOREIGN KEY ("yatchId") REFERENCES "Yatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
