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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members", label: "Members", icon: Users },
  { href: "/membership-plans", label: "Membership Plans", icon: Medal },
  { href: "/memberships", label: "Memberships", icon: TicketCheck },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/trainers", label: "Trainers", icon: Dumbbell },
  { href: "/classes", label: "Gym Classes", icon: CalendarCheck },
  { href: "/bookings", label: "Class Bookings", icon: ClipboardList },
  { href: "/attendance", label: "Attendance", icon: Activity }
];

export const navGroups = [
  { label: "Main", hrefs: ["/dashboard"] },
  { label: "Members & Plans", hrefs: ["/members", "/membership-plans", "/memberships"] },
  { label: "Operations", hrefs: ["/payments", "/trainers"] },
  { label: "Schedule", hrefs: ["/classes", "/bookings", "/attendance"] }
].map((group) => ({ ...group, items: navItems.filter((item) => group.hrefs.includes(item.href)) }));

export const authStorageKey = "adapt-auth-user";
