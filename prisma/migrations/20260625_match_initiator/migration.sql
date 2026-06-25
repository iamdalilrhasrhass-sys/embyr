-- Migration: add initiatorId to Match table for directional matching
ALTER TABLE "Match" ADD COLUMN IF NOT EXISTS "initiatorId" TEXT;
