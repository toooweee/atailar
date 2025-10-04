/*
  Warnings:

  - Added the required column `eventType` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('LOGGED_IN', 'SEND_BID', 'APPROVE_BID');

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "eventType" "EventType" NOT NULL;
