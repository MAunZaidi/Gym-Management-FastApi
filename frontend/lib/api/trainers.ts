import { mockDelay } from "@/lib/api/client";
import { trainers } from "@/lib/mock-data";

export async function getTrainers() {
  return mockDelay(trainers);
}
