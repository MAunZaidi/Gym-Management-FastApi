"use client";

import { useMemo, useState } from "react";
import { Plus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FormField, SelectField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { bookings as seedBookings, gymClasses, members } from "@/lib/mock-data";
import { formatDate, includesQuery } from "@/lib/utils";
import type { BookingStatus, ClassBooking } from "@/types";

const emptyBooking: ClassBooking = { id: "", classId: gymClasses[0]?.id ?? "", memberId: members[0]?.id ?? "", bookingDate: new Date().toISOString().slice(0, 10), status: "Booked" };

export default function BookingsPage() {
  const [bookings, setBookings] = useState(seedBookings);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [editing, setEditing] = useState<ClassBooking | null>(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => bookings.filter((booking) => includesQuery([booking.id, memberName(booking.memberId), className(booking.classId), booking.status], query)).filter((booking) => status === "All" || booking.status === status), [bookings, query, status]);

  function save(booking: ClassBooking) {
    const member = members.find((item) => item.id === booking.memberId);
    const gymClass = gymClasses.find((item) => item.id === booking.classId);
    if (!member?.active) {
      showToast({ type: "error", title: "Booking blocked", description: "Inactive members cannot be booked into classes." });
      return;
    }
    if (!gymClass || ["Full", "Cancelled", "Inactive"].includes(gymClass.status)) {
      showToast({ type: "error", title: "Booking blocked", description: "Unavailable classes cannot accept bookings." });
      return;
    }
    if (!booking.id) setBookings((current) => [{ ...booking, id: `B-${Math.floor(7400 + Math.random() * 599)}` }, ...current]);
    else setBookings((current) => current.map((item) => (item.id === booking.id ? booking : item)));
    showToast({ type: "success", title: booking.id ? "Booking updated" : "Booking created" });
    setEditing(null);
  }

  const columns: DataTableColumn<ClassBooking>[] = [
    { key: "booking", header: "Booking", render: (booking) => booking.id },
    { key: "class", header: "Class", render: (booking) => className(booking.classId) },
    { key: "member", header: "Member", render: (booking) => memberName(booking.memberId) },
    { key: "date", header: "Date", render: (booking) => formatDate(booking.bookingDate) },
    { key: "status", header: "Status", render: (booking) => <StatusBadge label={booking.status} /> },
    { key: "actions", header: "Actions", render: (booking) => <Button variant="ghost" icon={<XCircle className="h-4 w-4" />} onClick={() => { setBookings((current) => current.map((item) => item.id === booking.id ? { ...item, status: "Cancelled" } : item)); showToast({ title: "Booking cancelled" }); }} aria-label="Cancel booking" /> }
  ];

  return (
    <div className="grid gap-6">
      <PageHeader title="Class Bookings" description="Create, filter, cancel, and status-manage member class bookings with validation against inactive members and unavailable classes." action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing(emptyBooking)}>Create booking</Button>} />
      <Panel><div className="grid gap-3 lg:grid-cols-[1fr_190px]"><SearchInput value={query} onChange={setQuery} placeholder="Search bookings" /><SelectField label="Status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Booked</option><option>Checked In</option><option>Cancelled</option><option>Waitlisted</option></SelectField></div></Panel>
      <DataTable items={filtered} columns={columns} getKey={(booking) => booking.id} />
      <BookingForm key={editing ? editing.id || "new-booking" : "closed-booking"} booking={editing} onClose={() => setEditing(null)} onSave={save} />
    </div>
  );
}

function memberName(id: string) { return members.find((member) => member.id === id)?.name ?? "Unknown member"; }
function className(id: string) { return gymClasses.find((gymClass) => gymClass.id === id)?.name ?? "Unknown class"; }

function BookingForm({ booking, onClose, onSave }: { booking: ClassBooking | null; onClose: () => void; onSave: (booking: ClassBooking) => void }) {
  const [draft, setDraft] = useState(booking ?? emptyBooking);
  if (!booking) return null;
  return (
    <Modal open={Boolean(booking)} title={booking.id ? "Edit booking" : "Create booking"} onClose={onClose}>
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
        <SelectField label="Class" value={draft.classId} onChange={(event) => setDraft({ ...draft, classId: event.target.value })}>{gymClasses.map((gymClass) => <option key={gymClass.id} value={gymClass.id} disabled={["Full", "Cancelled", "Inactive"].includes(gymClass.status)}>{gymClass.name} · {gymClass.status}</option>)}</SelectField>
        <SelectField label="Member" value={draft.memberId} onChange={(event) => setDraft({ ...draft, memberId: event.target.value })}>{members.map((member) => <option key={member.id} value={member.id} disabled={!member.active}>{member.name}{member.active ? "" : " · inactive"}</option>)}</SelectField>
        <FormField label="Booking date" type="date" value={draft.bookingDate} onChange={(event) => setDraft({ ...draft, bookingDate: event.target.value })} />
        <SelectField label="Status" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as BookingStatus })}><option>Booked</option><option>Checked In</option><option>Cancelled</option><option>Waitlisted</option></SelectField>
        <div className="flex justify-end gap-3"><Button variant="secondary" type="button" onClick={onClose}>Cancel</Button><Button type="submit">Save booking</Button></div>
      </form>
    </Modal>
  );
}
