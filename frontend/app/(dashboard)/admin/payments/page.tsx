"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, Plus } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FormField, SelectField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { members, memberships, payments as seedPayments } from "@/lib/mock-data";
import { formatCurrency, formatDate, includesQuery } from "@/lib/utils";
import type { Payment, PaymentMethod, PaymentStatus } from "@/types";

const emptyPayment: Payment = {
  id: "",
  membershipId: memberships[0]?.id ?? "",
  amount: 0,
  paymentDate: new Date().toISOString().slice(0, 10),
  method: "Card",
  status: "Paid"
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState(seedPayments);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [editing, setEditing] = useState<Payment | null>(null);
  const [viewing, setViewing] = useState<Payment | null>(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    return payments
      .filter((payment) => {
        const membership = memberships.find((item) => item.id === payment.membershipId);
        const member = members.find((item) => item.id === membership?.memberId);
        return includesQuery([payment.id, member?.name, payment.status, payment.method], query);
      })
      .filter((payment) => (status === "All" ? true : payment.status === status));
  }, [payments, query, status]);

  const paidTotal = payments.filter((payment) => payment.status === "Paid").reduce((sum, payment) => sum + payment.amount, 0);
  const dueTotal = payments.filter((payment) => payment.status === "Due").reduce((sum, payment) => sum + payment.amount, 0);

  function save(payment: Payment) {
    if (!payment.id) {
      setPayments((current) => [{ ...payment, id: `PAY-${Math.floor(9200 + Math.random() * 799)}` }, ...current]);
      showToast({ type: "success", title: "Payment recorded" });
    } else {
      setPayments((current) => current.map((item) => (item.id === payment.id ? payment : item)));
      showToast({ type: "success", title: "Payment updated" });
    }
    setEditing(null);
  }

  const columns: DataTableColumn<Payment>[] = [
    { key: "id", header: "Payment", render: (payment) => payment.id },
    { key: "member", header: "Member", render: (payment) => memberName(payment.membershipId) },
    { key: "amount", header: "Amount", render: (payment) => formatCurrency(payment.amount) },
    { key: "date", header: "Date", render: (payment) => formatDate(payment.paymentDate) },
    { key: "method", header: "Method", render: (payment) => payment.method },
    { key: "status", header: "Status", render: (payment) => <StatusBadge label={payment.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (payment) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" icon={<Eye className="h-4 w-4" />} onClick={() => setViewing(payment)} aria-label="View payment" />
          <Button variant="ghost" icon={<Pencil className="h-4 w-4" />} onClick={() => setEditing(payment)} aria-label="Edit payment" />
        </div>
      )
    }
  ];

  return (
    <div className="grid gap-6">
      <PageHeader title="Payments" description="Track revenue, dues, methods, member context, and payment status." action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing(emptyPayment)}>Record payment</Button>} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(paidTotal)} detail="All paid payments in mock data." icon={<span>$</span>} tone="success" />
        <StatCard title="This Month" value={formatCurrency(2580)} detail="Ready to connect to reports endpoint." icon={<span>$</span>} tone="info" />
        <StatCard title="Paid Payments" value={String(payments.filter((item) => item.status === "Paid").length)} detail="Completed payment records." icon={<span>#</span>} />
        <StatCard title="Outstanding" value={formatCurrency(dueTotal)} detail="Due amount awaiting collection." icon={<span>!</span>} tone="warning" />
      </section>
      <Panel>
        <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
          <SearchInput value={query} onChange={setQuery} placeholder="Search payments" />
          <SelectField label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            <option>Paid</option>
            <option>Due</option>
          </SelectField>
        </div>
      </Panel>
      <DataTable items={filtered} columns={columns} getKey={(payment) => payment.id} />
      <PaymentForm key={editing ? editing.id || "new-payment" : "closed-payment"} payment={editing} onClose={() => setEditing(null)} onSave={save} />
      <Modal open={Boolean(viewing)} title={viewing?.id ?? "Payment"} onClose={() => setViewing(null)}>
        {viewing ? <p className="text-sm text-adapt-subtle">{memberName(viewing.membershipId)} paid {formatCurrency(viewing.amount)} by {viewing.method}.</p> : null}
      </Modal>
    </div>
  );
}

function memberName(membershipId: string) {
  const membership = memberships.find((item) => item.id === membershipId);
  return members.find((item) => item.id === membership?.memberId)?.name ?? "Unknown member";
}

function PaymentForm({ payment, onClose, onSave }: { payment: Payment | null; onClose: () => void; onSave: (payment: Payment) => void }) {
  const [draft, setDraft] = useState(payment ?? emptyPayment);
  if (!payment) return null;

  return (
    <Modal open={Boolean(payment)} title={payment.id ? "Edit payment" : "Record payment"} onClose={onClose}>
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
        <SelectField label="Membership" value={draft.membershipId} onChange={(event) => setDraft({ ...draft, membershipId: event.target.value })}>
          {memberships.map((item) => <option key={item.id} value={item.id}>{item.id} · {memberName(item.id)}</option>)}
        </SelectField>
        <FormField label="Amount" type="number" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: Number(event.target.value) })} />
        <FormField label="Payment date" type="date" value={draft.paymentDate} onChange={(event) => setDraft({ ...draft, paymentDate: event.target.value })} />
        <SelectField label="Method" value={draft.method} onChange={(event) => setDraft({ ...draft, method: event.target.value as PaymentMethod })}>
          <option>Card</option>
          <option>Cash</option>
          <option>Bank Transfer</option>
          <option>UPI</option>
        </SelectField>
        <SelectField label="Status" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as PaymentStatus })}>
          <option>Paid</option>
          <option>Due</option>
        </SelectField>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save payment</Button>
        </div>
      </form>
    </Modal>
  );
}
