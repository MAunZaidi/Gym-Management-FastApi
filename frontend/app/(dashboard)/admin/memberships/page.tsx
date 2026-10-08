"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FormField, SelectField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { members, membershipPlans, memberships as seedMemberships, trainers } from "@/lib/mock-data";
import { formatDate, includesQuery } from "@/lib/utils";
import type { Membership, MembershipStatus } from "@/types";

const emptyMembership: Membership = {
  id: "",
  memberId: members[0]?.id ?? "",
  planId: membershipPlans[0]?.id ?? "",
  trainerId: trainers[0]?.id,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  status: "Active"
};

export default function MembershipsPage() {
  const [records, setRecords] = useState(seedMemberships);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [plan, setPlan] = useState("All");
  const [editing, setEditing] = useState<Membership | null>(null);
  const [viewing, setViewing] = useState<Membership | null>(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    return records
      .filter((record) => {
        const member = members.find((item) => item.id === record.memberId);
        const planRecord = membershipPlans.find((item) => item.id === record.planId);
        return includesQuery([record.id, member?.name, planRecord?.name, record.status], query);
      })
      .filter((record) => (status === "All" ? true : record.status === status))
      .filter((record) => (plan === "All" ? true : record.planId === plan));
  }, [plan, query, records, status]);

  function save(record: Membership) {
    if (!record.id) {
      setRecords((current) => [{ ...record, id: `MS-${Math.floor(6000 + Math.random() * 999)}` }, ...current]);
      showToast({ type: "success", title: "Membership created" });
    } else {
      setRecords((current) => current.map((item) => (item.id === record.id ? record : item)));
      showToast({ type: "success", title: "Membership updated" });
    }
    setEditing(null);
  }

  const columns: DataTableColumn<Membership>[] = [
    { key: "id", header: "ID", render: (record) => record.id },
    { key: "member", header: "Member", render: (record) => members.find((item) => item.id === record.memberId)?.name },
    { key: "plan", header: "Plan", render: (record) => membershipPlans.find((item) => item.id === record.planId)?.name },
    { key: "trainer", header: "Trainer", render: (record) => trainers.find((item) => item.id === record.trainerId)?.name ?? "Unassigned" },
    { key: "range", header: "Dates", render: (record) => `${formatDate(record.startDate)} - ${formatDate(record.endDate)}` },
    { key: "status", header: "Status", render: (record) => <StatusBadge label={record.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (record) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" icon={<Eye className="h-4 w-4" />} onClick={() => setViewing(record)} aria-label="View membership" />
          <Button variant="ghost" icon={<Pencil className="h-4 w-4" />} onClick={() => setEditing(record)} aria-label="Edit membership" />
          <Button
            variant="ghost"
            icon={<XCircle className="h-4 w-4" />}
            onClick={() => {
              setRecords((current) => current.map((item) => (item.id === record.id ? { ...item, status: "Cancelled" } : item)));
              showToast({ title: "Membership cancelled" });
            }}
            disabled={record.status === "Cancelled"}
            aria-label="Cancel membership"
          />
        </div>
      )
    }
  ];

  return (
    <div className="grid gap-6">
      <PageHeader title="Memberships" description="Assign members to plans, trainers, date ranges, and lifecycle statuses." action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing(emptyMembership)}>Create membership</Button>} />
      <Panel>
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_220px]">
          <SearchInput value={query} onChange={setQuery} placeholder="Search memberships" />
          <SelectField label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>Expired</option>
            <option>Cancelled</option>
          </SelectField>
          <SelectField label="Plan" value={plan} onChange={(event) => setPlan(event.target.value)}>
            <option value="All">All</option>
            {membershipPlans.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </SelectField>
        </div>
      </Panel>
      <DataTable items={filtered} columns={columns} getKey={(record) => record.id} />
      <MembershipForm key={editing ? editing.id || "new-membership" : "closed-membership"} record={editing} onClose={() => setEditing(null)} onSave={save} />
      <Modal open={Boolean(viewing)} title={viewing?.id ?? "Membership"} onClose={() => setViewing(null)}>
        {viewing ? <MembershipSummary record={viewing} /> : null}
      </Modal>
    </div>
  );
}

function MembershipForm({ record, onClose, onSave }: { record: Membership | null; onClose: () => void; onSave: (record: Membership) => void }) {
  const [draft, setDraft] = useState(record ?? emptyMembership);
  if (!record) return null;

  return (
    <Modal open={Boolean(record)} title={record.id ? "Edit membership" : "Create membership"} onClose={onClose} size="lg">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
        <SelectField label="Member" value={draft.memberId} onChange={(event) => setDraft({ ...draft, memberId: event.target.value })}>
          {members.filter((member) => member.active).map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
        </SelectField>
        <SelectField label="Plan" value={draft.planId} onChange={(event) => setDraft({ ...draft, planId: event.target.value })}>
          {membershipPlans.filter((item) => item.active).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </SelectField>
        <SelectField label="Trainer" value={draft.trainerId ?? ""} onChange={(event) => setDraft({ ...draft, trainerId: event.target.value || undefined })}>
          <option value="">Unassigned</option>
          {trainers.filter((trainer) => trainer.status !== "Inactive").map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.name}</option>)}
        </SelectField>
        <SelectField label="Status" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as MembershipStatus })}>
          <option>Active</option>
          <option>Expired</option>
          <option>Cancelled</option>
        </SelectField>
        <FormField label="Start date" type="date" value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} />
        <FormField label="End date" type="date" value={draft.endDate} onChange={(event) => setDraft({ ...draft, endDate: event.target.value })} />
        <div className="flex justify-end gap-3 sm:col-span-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save membership</Button>
        </div>
      </form>
    </Modal>
  );
}

function MembershipSummary({ record }: { record: Membership }) {
  return (
    <div className="grid gap-3">
      <StatusBadge label={record.status} />
      <p className="text-sm text-adapt-subtle">Member: {members.find((item) => item.id === record.memberId)?.name}</p>
      <p className="text-sm text-adapt-subtle">Plan: {membershipPlans.find((item) => item.id === record.planId)?.name}</p>
      <p className="text-sm text-adapt-subtle">Trainer: {trainers.find((item) => item.id === record.trainerId)?.name ?? "Unassigned"}</p>
    </div>
  );
}
