export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

export type Gender = "Male" | "Female" | "Other";

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  joinedDate: string;
  active: boolean;
};

export type MembershipPlan = {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  description: string;
  features: string[];
  active: boolean;
};

export type MembershipStatus = "Active" | "Expired" | "Cancelled";

export type Membership = {
  id: string;
  memberId: string;
  planId: string;
  trainerId?: string;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
};

export type PaymentStatus = "Paid" | "Due";
export type PaymentMethod = "Card" | "Cash" | "Bank Transfer" | "UPI";

export type Payment = {
  id: string;
  membershipId: string;
  amount: number;
  paymentDate: string;
  method: PaymentMethod;
  status: PaymentStatus;
};

export type TrainerStatus = "Available" | "Busy" | "Inactive";

export type Trainer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  availability: string;
  status: TrainerStatus;
  assignedMemberIds: string[];
  assignedClassIds: string[];
};

export type ClassStatus = "Scheduled" | "Full" | "Cancelled" | "Inactive";

export type GymClass = {
  id: string;
  name: string;
  trainerId: string;
  description: string;
  schedule: string;
  durationMinutes: number;
  capacity: number;
  enrolled: number;
  status: ClassStatus;
};

export type BookingStatus = "Booked" | "Checked In" | "Cancelled" | "Waitlisted";

export type ClassBooking = {
  id: string;
  classId: string;
  memberId: string;
  bookingDate: string;
  status: BookingStatus;
};

export type AttendanceStatus = "Checked In" | "Checked Out" | "Absent";

export type Attendance = {
  id: string;
  memberId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
};

export type AdminUser = {
  name: string;
  email: string;
  role: "Owner" | "Manager" | "Staff";
};
