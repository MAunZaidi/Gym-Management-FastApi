import { mockDelay } from "@/lib/api/client";
import { members } from "@/lib/mock-data";

export async function getMembers() {
  return mockDelay(members);
}
