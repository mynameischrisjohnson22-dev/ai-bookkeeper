/*
  Warnings:

  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Subscription_paddleSubId_idx" ON "Subscription"("paddleSubId");

-- CreateIndex
CREATE INDEX "Transaction_deletedAt_idx" ON "Transaction"("deletedAt");

-- CreateIndex
CREATE INDEX "Usage_type_idx" ON "Usage"("type");
