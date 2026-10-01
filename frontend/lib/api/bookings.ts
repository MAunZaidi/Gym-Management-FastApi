import { mockDelay } from "@/lib/api/client";
import { bookings } from "@/lib/mock-data";

export async function getBookings() {
  return mockDelay(bookings);
}
