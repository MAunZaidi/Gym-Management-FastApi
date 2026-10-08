import {
  Activity,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  Medal,
  TicketCheck,
  Users
} from "lucide-react";

export const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/membership-plans", label: "Membership Plans", icon: Medal },
  { href: "/admin/memberships", label: "Memberships", icon: TicketCheck },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/trainers", label: "Trainers", icon: Dumbbell },
  { href: "/admin/classes", label: "Gym Classes", icon: CalendarCheck },
  { href: "/admin/bookings", label: "Class Bookings", icon: ClipboardList },
  { href: "/admin/attendance", label: "Attendance", icon: Activity }
];

export const navGroups = [
  { label: "Main", hrefs: ["/admin"] },
  { label: "Members & Plans", hrefs: ["/admin/members", "/admin/membership-plans", "/admin/memberships"] },
  { label: "Operations", hrefs: ["/admin/payments", "/admin/trainers"] },
  { label: "Schedule", hrefs: ["/admin/classes", "/admin/bookings", "/admin/attendance"] }
].map((group) => ({ ...group, items: navItems.filter((item) => group.hrefs.includes(item.href)) }));

export const authStorageKey = "adapt-auth-user";
