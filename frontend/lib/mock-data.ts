import type {
  Attendance,
  ClassBooking,
  GymClass,
  Member,
  Membership,
  MembershipPlan,
  Payment,
  Trainer
} from "@/types";

export const members: Member[] = [
  {
    id: "M-1001",
    name: "Maya Thompson",
    email: "maya@adaptgym.test",
    phone: "555-0142",
    gender: "Female",
    dateOfBirth: "1995-04-18",
    address: "21 Market Street",
    joinedDate: "2026-01-08",
    active: true
  },
  {
    id: "M-1002",
    name: "Jordan Lee",
    email: "jordan@adaptgym.test",
    phone: "555-0188",
    gender: "Male",
    dateOfBirth: "1991-11-22",
    address: "8 Pine Avenue",
    joinedDate: "2026-02-14",
    active: true
  },
  {
    id: "M-1003",
    name: "Avery Singh",
    email: "avery@adaptgym.test",
    phone: "555-0104",
    gender: "Other",
    dateOfBirth: "1999-07-03",
    address: "77 Cedar Road",
    joinedDate: "2026-05-20",
    active: false
  },
  {
    id: "M-1004",
    name: "Daniel Rivera",
    email: "daniel@adaptgym.test",
    phone: "555-0155",
    gender: "Male",
    dateOfBirth: "1988-09-30",
    address: "43 Lake Drive",
    joinedDate: "2026-03-02",
    active: true
  },
  {
    id: "M-1005",
    name: "Nora Patel",
    email: "nora@adaptgym.test",
    phone: "555-0129",
    gender: "Female",
    dateOfBirth: "1997-02-10",
    address: "16 Union Plaza",
    joinedDate: "2026-07-12",
    active: true
  }
];

export const membershipPlans: MembershipPlan[] = [
  {
    id: "P-01",
    name: "Normal",
    durationDays: 30,
    price: 49,
    description: "Flexible access for steady training routines.",
    features: ["Gym floor access", "Locker room", "Monthly assessment"],
    active: true
  },
  {
    id: "P-02",
    name: "Premium",
    durationDays: 90,
    price: 129,
    description: "A balanced plan for members who want coaching support.",
    features: ["All Normal features", "2 trainer sessions", "Class priority"],
    active: true
  },
  {
    id: "P-03",
    name: "Elite",
    durationDays: 365,
    price: 799,
    description: "Full-year access with high-touch performance guidance.",
    features: ["All Premium features", "Nutrition consult", "Recovery lounge"],
    active: true
  },
  {
    id: "P-04",
    name: "Student",
    durationDays: 30,
    price: 35,
    description: "Accessible pricing for verified students.",
    features: ["Gym floor access", "Off-peak classes", "Progress tracking"],
    active: false
  }
];

export const trainers: Trainer[] = [
  {
    id: "T-01",
    name: "Elena Brooks",
    email: "elena@adaptgym.test",
    phone: "555-0177",
    specialization: "Strength",
    availability: "Mon, Wed, Fri",
    status: "Available",
    assignedMemberIds: ["M-1001", "M-1004"],
    assignedClassIds: ["C-01", "C-03"]
  },
  {
    id: "T-02",
    name: "Marcus Reed",
    email: "marcus@adaptgym.test",
    phone: "555-0193",
    specialization: "HIIT",
    availability: "Tue, Thu, Sat",
    status: "Busy",
    assignedMemberIds: ["M-1002"],
    assignedClassIds: ["C-02"]
  },
  {
    id: "T-03",
    name: "Priya Kapoor",
    email: "priya@adaptgym.test",
    phone: "555-0136",
    specialization: "Mobility",
    availability: "Weekdays",
    status: "Available",
    assignedMemberIds: ["M-1005"],
    assignedClassIds: ["C-04"]
  }
];

export const memberships: Membership[] = [
  {
    id: "MS-5001",
    memberId: "M-1001",
    planId: "P-03",
    trainerId: "T-01",
    startDate: "2026-01-08",
    endDate: "2027-01-08",
    status: "Active"
  },
  {
    id: "MS-5002",
    memberId: "M-1002",
    planId: "P-02",
    trainerId: "T-02",
    startDate: "2026-08-01",
    endDate: "2026-10-30",
    status: "Active"
  },
  {
    id: "MS-5003",
    memberId: "M-1003",
    planId: "P-01",
    startDate: "2026-05-20",
    endDate: "2026-06-20",
    status: "Expired"
  },
  {
    id: "MS-5004",
    memberId: "M-1004",
    planId: "P-02",
    trainerId: "T-01",
    startDate: "2026-09-12",
    endDate: "2026-12-12",
    status: "Active"
  },
  {
    id: "MS-5005",
    memberId: "M-1005",
    planId: "P-01",
    trainerId: "T-03",
    startDate: "2026-07-12",
    endDate: "2026-08-12",
    status: "Cancelled"
  }
];

export const payments: Payment[] = [
  {
    id: "PAY-9001",
    membershipId: "MS-5001",
    amount: 799,
    paymentDate: "2026-01-08",
    method: "Card",
    status: "Paid"
  },
  {
    id: "PAY-9002",
    membershipId: "MS-5002",
    amount: 129,
    paymentDate: "2026-08-01",
    method: "UPI",
    status: "Paid"
  },
  {
    id: "PAY-9003",
    membershipId: "MS-5004",
    amount: 129,
    paymentDate: "2026-09-12",
    method: "Cash",
    status: "Due"
  },
  {
    id: "PAY-9004",
    membershipId: "MS-5003",
    amount: 49,
    paymentDate: "2026-05-20",
    method: "Bank Transfer",
    status: "Paid"
  }
];

export const gymClasses: GymClass[] = [
  {
    id: "C-01",
    name: "Strength Circuit",
    trainerId: "T-01",
    description: "Progressive compound lifts with coach-led stations.",
    schedule: "Mon 7:00 AM",
    durationMinutes: 55,
    capacity: 18,
    enrolled: 14,
    status: "Scheduled"
  },
  {
    id: "C-02",
    name: "HIIT Engine",
    trainerId: "T-02",
    description: "Short intervals, sled pushes, bikes, and recovery pacing.",
    schedule: "Tue 6:00 PM",
    durationMinutes: 45,
    capacity: 16,
    enrolled: 16,
    status: "Full"
  },
  {
    id: "C-03",
    name: "Barbell Basics",
    trainerId: "T-01",
    description: "Technique-first foundations for new lifters.",
    schedule: "Wed 5:30 PM",
    durationMinutes: 50,
    capacity: 12,
    enrolled: 8,
    status: "Scheduled"
  },
  {
    id: "C-04",
    name: "Mobility Reset",
    trainerId: "T-03",
    description: "Joint prep, mobility flows, and cooldown breathing.",
    schedule: "Fri 8:00 AM",
    durationMinutes: 40,
    capacity: 20,
    enrolled: 11,
    status: "Scheduled"
  }
];

export const bookings: ClassBooking[] = [
  { id: "B-7001", classId: "C-01", memberId: "M-1001", bookingDate: "2026-10-01", status: "Booked" },
  { id: "B-7002", classId: "C-02", memberId: "M-1002", bookingDate: "2026-10-01", status: "Checked In" },
  { id: "B-7003", classId: "C-04", memberId: "M-1005", bookingDate: "2026-10-02", status: "Booked" },
  { id: "B-7004", classId: "C-03", memberId: "M-1004", bookingDate: "2026-10-03", status: "Waitlisted" }
];

export const attendance: Attendance[] = [
  {
    id: "A-3001",
    memberId: "M-1001",
    date: "2026-10-01",
    checkInTime: "07:05",
    status: "Checked In"
  },
  {
    id: "A-3002",
    memberId: "M-1002",
    date: "2026-10-01",
    checkInTime: "08:12",
    checkOutTime: "09:04",
    status: "Checked Out"
  },
  {
    id: "A-3003",
    memberId: "M-1004",
    date: "2026-10-01",
    checkInTime: "12:22",
    status: "Checked In"
  },
  {
    id: "A-3004",
    memberId: "M-1005",
    date: "2026-09-30",
    checkInTime: "18:45",
    checkOutTime: "19:50",
    status: "Checked Out"
  }
];
