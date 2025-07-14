import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const FREE_POINTS = 10; // Free points for the first 30 days
const DURATION = 30 * 24 * 60 * 60; // 30 days in seconds
const GENERATION_POINTS = 1; // Points consumed per generation
const PRO_POINTS = 100; // Points for pro users
export async function getUsageTracker() {
  const { has } = await auth();
  const hasProAccess = has({ plan: "pro" });
  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: hasProAccess ? PRO_POINTS : FREE_POINTS, // Points for free users or pro users
    duration: DURATION, // 30 days
  });
  return usageTracker;
}

export async function consumeCredits() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const usageTracker = await getUsageTracker();
  const res = await usageTracker.consume(userId, GENERATION_POINTS);
  return res;
}

export async function getUsageStatus() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const usageTracker = await getUsageTracker();
  const res = await usageTracker.get(userId);
  return res;
}
