-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crypto" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "marketCap" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "highestValue" DOUBLE PRECISION NOT NULL,
    "highestValueDate" TIMESTAMP(3) NOT NULL,
    "lowestValue" DOUBLE PRECISION NOT NULL,
    "lowestValueDate" TIMESTAMP(3) NOT NULL,
    "variation24h" DOUBLE PRECISION NOT NULL,
    "variation7d" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crypto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoUpdate" (
    "id" TEXT NOT NULL,
    "cryptoId" TEXT NOT NULL,
    "marketCap" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "variation24h" DOUBLE PRECISION NOT NULL,
    "variation7d" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ath" DOUBLE PRECISION NOT NULL,
    "athDate" TIMESTAMP(3) NOT NULL,
    "atl" DOUBLE PRECISION NOT NULL,
    "atlDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CryptoUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_name_key" ON "Crypto"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_symbol_key" ON "Crypto"("symbol");

-- AddForeignKey
ALTER TABLE "CryptoUpdate" ADD CONSTRAINT "CryptoUpdate_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "Crypto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
