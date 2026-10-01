import { mockDelay } from "@/lib/api/client";
import { membershipPlans } from "@/lib/mock-data";

export async function getMembershipPlans() {
  return mockDelay(membershipPlans);
}
