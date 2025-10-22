/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `Charge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "idempotencyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Charge_idempotencyKey_key" ON "Charge"("idempotencyKey");
