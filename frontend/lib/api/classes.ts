import { mockDelay } from "@/lib/api/client";
import { gymClasses } from "@/lib/mock-data";

export async function getGymClasses() {
  return mockDelay(gymClasses);
}
