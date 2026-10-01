"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Power, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField, SelectField, TextAreaField, ToggleField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { Panel } from "@/components/ui/panel";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { attendance, bookings, members as seedMembers, memberships, payments } from "@/lib/mock-data";
import { formatCurrency, formatDate, includesQuery } from "@/lib/utils";
import type { Gender, Member } from "@/types";

const emptyMember: Member = {
  id: "",
  name: "",
  email: "",
  phone: "",
  gender: "Female",
  dateOfBirth: "",
  address: "",
  joinedDate: new Date().toISOString().slice(0, 10),
  active: true
};

export default function MembersPage() {
  const [members, setMembers] = useState(seedMembers);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Member | null>(null);
  const [viewing, setViewing] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const { showToast } = useToast();
  const pageSize = 6;

  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => includesQuery([member.id, member.name, member.email, member.phone], query))
      .filter((member) => (statusFilter === "All" ? true : member.active === (statusFilter === "Active")))
      .filter((member) => (genderFilter === "All" ? true : member.gender === genderFilter))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [genderFilter, members, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const visibleMembers = filteredMembers.slice((page - 1) * pageSize, page * pageSize);

  function saveMember(member: Member) {
    if (!member.id) {
      const created = { ...member, id: `M-${Math.floor(1000 + Math.random() * 9000)}` };
      setMembers((current) => [created, ...current]);
      showToast({ type: "success", title: "Member added", description: `${created.name} is now in the roster.` });
    } else {
      setMembers((current) => current.map((item) => (item.id === member.id ? member : item)));
      showToast({ type: "success", title: "Member updated", description: `${member.name}'s profile was saved.` });
    }
    setEditing(null);
  }

  const columns: DataTableColumn<Member>[] = [
    {
      key: "member",
      header: "Member",
      render: (member) => (
        <div>
          <p className="font-semibold text-adapt-text">{member.name}</p>
          <p className="text-xs text-adapt-subtle">{member.email}</p>
        </div>
      )
    },
    { key: "phone", header: "Phone", render: (member) => member.phone },
    { key: "gender", header: "Gender", render: (member) => member.gender },
    { key: "joined", header: "Joined", render: (member) => formatDate(member.joinedDate) },
    { key: "status", header: "Status", render: (member) => <StatusBadge label={member.active ? "Active" : "Inactive"} /> },
    {
      key: "actions",
      header: "Actions",
      render: (member) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" icon={<Eye className="h-4 w-4" />} onClick={() => setViewing(member)} aria-label="View member" />
          <Button variant="ghost" icon={<Pencil className="h-4 w-4" />} onClick={() => setEditing(member)} aria-label="Edit member" />
          <Button
            variant="ghost"
            icon={<Power className="h-4 w-4" />}
            onClick={() => {
              setMembers((current) => current.map((item) => (item.id === member.id ? { ...item, active: !item.active } : item)));
              showToast({ title: member.active ? "Member deactivated" : "Member activated" });
            }}
            aria-label="Toggle member status"
          />
          <Button variant="ghost" icon={<Trash2 className="h-4 w-4" />} onClick={() => setDeleteTarget(member)} aria-label="Delete member" />
        </div>
      )
    }
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Members"
        description="Manage member profiles, contact details, activity status, and operational history."
        action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing(emptyMember)}>Add member</Button>}
      />
      <Panel>
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <SearchInput value={query} onChange={setQuery} placeholder="Search members" />
          <SelectField label="Status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </SelectField>
          <SelectField label="Gender" value={genderFilter} onChange={(event) => setGenderFilter(event.target.value)}>
            <option>All</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </SelectField>
        </div>
      </Panel>
      {visibleMembers.length ? (
        <>
          <DataTable items={visibleMembers} columns={columns} getKey={(member) => member.id} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState title="No members found" description="Adjust search or filters, or add a new member to start building the roster." />
      )}
      <MemberForm key={editing ? editing.id || "new-member" : "closed-member"} member={editing} onClose={() => setEditing(null)} onSave={saveMember} />
      <MemberProfile member={viewing} onClose={() => setViewing(null)} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete member?"
        description={`Remove ${deleteTarget?.name ?? "this member"} from the roster.`}
        confirmLabel="Delete member"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setMembers((current) => current.filter((member) => member.id !== deleteTarget.id));
          showToast({ type: "success", title: "Member deleted" });
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

function MemberForm({ member, onClose, onSave }: { member: Member | null; onClose: () => void; onSave: (member: Member) => void }) {
  const [draft, setDraft] = useState<Member>(member ?? emptyMember);

  if (!member) return null;

  return (
    <Modal open={Boolean(member)} title={member.id ? "Edit member" : "Add member"} description="Use data-specific controls for clean records." onClose={onClose} size="lg">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
      >
        <FormField required label="Name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <FormField required label="Email" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
        <FormField required label="Phone" type="tel" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
        <SelectField label="Gender" value={draft.gender} onChange={(event) => setDraft({ ...draft, gender: event.target.value as Gender })}>
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
        </SelectField>
        <FormField required label="Date of birth" type="date" value={draft.dateOfBirth} onChange={(event) => setDraft({ ...draft, dateOfBirth: event.target.value })} />
        <FormField required label="Joined date" type="date" value={draft.joinedDate} onChange={(event) => setDraft({ ...draft, joinedDate: event.target.value })} />
        <div className="sm:col-span-2">
          <TextAreaField label="Address" value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <ToggleField label="Active member" checked={draft.active} onChange={(checked) => setDraft({ ...draft, active: checked })} />
        </div>
        <div className="flex justify-end gap-3 sm:col-span-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save member</Button>
        </div>
      </form>
    </Modal>
  );
}

function MemberProfile({ member, onClose }: { member: Member | null; onClose: () => void }) {
  const memberMemberships = memberships.filter((item) => item.memberId === member?.id);
  const memberAttendance = attendance.filter((item) => item.memberId === member?.id);
  const memberBookings = bookings.filter((item) => item.memberId === member?.id);
  const memberPayments = payments.filter((payment) => memberMemberships.some((membership) => membership.id === payment.membershipId));

  return (
    <Modal open={Boolean(member)} title={member?.name ?? "Member profile"} description="Membership, payment, attendance, and booking context." onClose={onClose} size="xl">
      {member ? (
        <div className="grid gap-4 lg:grid-cols-4">
          <Panel className="lg:col-span-1">
            <StatusBadge label={member.active ? "Active" : "Inactive"} />
            <p className="mt-4 text-sm text-adapt-subtle">{member.email}</p>
            <p className="mt-1 text-sm text-adapt-subtle">{member.phone}</p>
            <p className="mt-1 text-sm text-adapt-subtle">{member.address}</p>
          </Panel>
          <Panel className="lg:col-span-3">
            <div className="grid gap-4 md:grid-cols-3">
              <ProfileMetric label="Memberships" value={String(memberMemberships.length)} />
              <ProfileMetric label="Payments" value={formatCurrency(memberPayments.reduce((sum, payment) => sum + payment.amount, 0))} />
              <ProfileMetric label="Attendance" value={String(memberAttendance.length)} />
            </div>
            <div className="mt-5 grid gap-3">
              {memberBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between rounded-adapt bg-[#12141A] p-3">
                  <span className="text-sm">{booking.id} · {formatDate(booking.bookingDate)}</span>
                  <StatusBadge label={booking.status} />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      ) : null}
    </Modal>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-adapt bg-[#12141A] p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-adapt-subtle">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}
