-- DropIndex
DROP INDEX "Category_parent_idx";

-- DropIndex
DROP INDEX "Category_userId_idx";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "isCOGS" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "parent" DROP NOT NULL;
