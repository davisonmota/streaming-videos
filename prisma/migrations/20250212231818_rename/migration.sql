/*
  Warnings:

  - You are about to drop the column `minetype` on the `Video` table. All the data in the column will be lost.
  - Added the required column `mimetype` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "minetype",
ADD COLUMN     "mimetype" TEXT NOT NULL;
