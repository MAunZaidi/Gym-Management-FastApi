import { mockDelay } from "@/lib/api/client";
import { attendance } from "@/lib/mock-data";

export async function getAttendance() {
  return mockDelay(attendance);
}
