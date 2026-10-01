"use client";

import { Activity, CalendarClock, CreditCard, DollarSign, UserCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { MiniChart } from "@/components/dashboard/mini-chart";
import { members, memberships, payments, gymClasses } from "@/lib/mock-data";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

export default function DashboardPage() {
  const ref = useGsapReveal<HTMLDivElement>();
  const activeMemberships = memberships.filter((item) => item.status === "Active");
  const paid = payments.filter((payment) => payment.status === "Paid");
  const due = payments.filter((payment) => payment.status === "Due");
  const revenue = paid.reduce((sum, payment) => sum + payment.amount, 0);
  const expiring = activeMemberships.filter((membership) => daysUntil(membership.endDate) <= 45);

  return (
    <div ref={ref} className="grid gap-6">
      <PageHeader
        title="Dashboard"
        description="A quick operational snapshot of members, revenue, attendance, upcoming classes, and membership risk."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Members" value={String(members.length)} detail="4 active members in the current roster." icon={<Users className="h-5 w-5" />} />
        <StatCard title="Active Memberships" value={String(activeMemberships.length)} detail={`${expiring.length} ending soon.`} icon={<UserCheck className="h-5 w-5" />} tone="success" />
        <StatCard title="Monthly Revenue" value={formatCurrency(revenue)} detail={`${formatCurrency(due.reduce((sum, payment) => sum + payment.amount, 0))} outstanding.`} icon={<DollarSign className="h-5 w-5" />} tone="info" />
        <StatCard title="Today" value="3 / 4" detail="Attendance check-ins and scheduled classes." icon={<Activity className="h-5 w-5" />} tone="warning" />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <MiniChart title="Revenue Trend" values={[6200, 7800, 7300, 9300, 10800, 12400]} labels={["May", "Jun", "Jul", "Aug", "Sep", "Oct"]} />
        <MiniChart title="Membership Growth" values={[62, 78, 95, 102, 116, 128]} labels={["May", "Jun", "Jul", "Aug", "Sep", "Oct"]} />
      </section>
      <section className="grid gap-4 xl:grid-cols-3">
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent Payments</h2>
            <CreditCard className="h-5 w-5 text-adapt-primary" />
          </div>
          <div className="mt-4 grid gap-3">
            {payments.slice(0, 4).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between gap-3 rounded-adapt bg-[#12141A] p-3">
                <div>
                  <p className="text-sm font-semibold">{payment.id}</p>
                  <p className="text-xs text-adapt-subtle">{formatDate(payment.paymentDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                  <StatusBadge label={payment.status} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Upcoming Classes</h2>
            <CalendarClock className="h-5 w-5 text-adapt-primary" />
          </div>
          <div className="mt-4 grid gap-3">
            {gymClasses.map((gymClass) => (
              <div key={gymClass.id} className="rounded-adapt bg-[#12141A] p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{gymClass.name}</p>
                  <StatusBadge label={gymClass.status} />
                </div>
                <p className="mt-2 text-xs text-adapt-subtle">
                  {gymClass.schedule} · {gymClass.enrolled}/{gymClass.capacity} booked
                </p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-base font-semibold">Expiry Alerts</h2>
          <div className="mt-4 grid gap-3">
            {expiring.map((membership) => {
              const member = members.find((item) => item.id === membership.memberId);
              return (
                <div key={membership.id} className="rounded-adapt border border-amber-300/20 bg-amber-300/10 p-3">
                  <p className="text-sm font-semibold text-amber-100">{member?.name}</p>
                  <p className="mt-1 text-xs text-amber-100/75">Ends {formatDate(membership.endDate)}</p>
                </div>
              );
            })}
            {!expiring.length ? <p className="text-sm text-adapt-subtle">No memberships are close to expiry.</p> : null}
          </div>
        </Panel>
      </section>
    </div>
  );
}
