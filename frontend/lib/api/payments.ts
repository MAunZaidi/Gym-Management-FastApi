import { mockDelay } from "@/lib/api/client";
import { payments } from "@/lib/mock-data";

export async function getPayments() {
  return mockDelay(payments);
}
