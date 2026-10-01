import { mockDelay } from "@/lib/api/client";
import { memberships } from "@/lib/mock-data";

export async function getMemberships() {
  return mockDelay(memberships);
}
