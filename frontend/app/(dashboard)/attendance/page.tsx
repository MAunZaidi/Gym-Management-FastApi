"use client";

import { useMemo, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FormField, SelectField } from "@/components/ui/form-field";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { attendance as seedAttendance, members } from "@/lib/mock-data";
import { formatDate, includesQuery } from "@/lib/utils";
import type { Attendance } from "@/types";

export default function AttendancePage() {
  const today = "2026-10-01";
  const [records, setRecords] = useState(seedAttendance);
  const [memberId, setMemberId] = useState(members.find((member) => member.active)?.id ?? "");
  const [date, setDate] = useState(today);
  const [query, setQuery] = useState("");
  const { showToast } = useToast();

  const filtered = useMemo(() => records.filter((record) => record.date === date).filter((record) => includesQuery([memberName(record.memberId), record.status], query)), [date, query, records]);

  function checkIn() {
    if (records.some((record) => record.memberId === memberId && record.date === date && record.status === "Checked In")) {
      showToast({ type: "info", title: "Already checked in" });
      return;
    }
    setRecords((current) => [{ id: `A-${Math.floor(3300 + Math.random() * 500)}`, memberId, date, checkInTime: "09:30", status: "Checked In" }, ...current]);
    showToast({ type: "success", title: "Member checked in" });
  }

  function checkOut(record: Attendance) {
    setRecords((current) => current.map((item) => item.id === record.id ? { ...item, status: "Checked Out", checkOutTime: "10:45" } : item));
    showToast({ type: "success", title: "Member checked out" });
  }

  const columns: DataTableColumn<Attendance>[] = [
    { key: "member", header: "Member", render: (record) => memberName(record.memberId) },
    { key: "date", header: "Date", render: (record) => formatDate(record.date) },
    { key: "in", header: "Check-in", render: (record) => record.checkInTime ?? "-" },
    { key: "out", header: "Check-out", render: (record) => record.checkOutTime ?? "-" },
    { key: "status", header: "Status", render: (record) => <StatusBadge label={record.status} /> },
    { key: "actions", header: "Actions", render: (record) => <Button variant="ghost" icon={<LogOut className="h-4 w-4" />} disabled={record.status !== "Checked In"} onClick={() => checkOut(record)} aria-label="Check out member" /> }
  ];

  return (
    <div className="grid gap-6">
      <PageHeader title="Attendance" description="Fast daily check-in and check-out flow for front-desk gym staff, with daily history and search." />
      <Panel>
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_auto_auto]">
          <SelectField label="Member" value={memberId} onChange={(event) => setMemberId(event.target.value)}>{members.filter((member) => member.active).map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</SelectField>
          <FormField label="Date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <div className="flex items-end"><Button icon={<LogIn className="h-4 w-4" />} onClick={checkIn}>Check in</Button></div>
          <div className="flex items-end"><SearchInput value={query} onChange={setQuery} placeholder="Search day" /></div>
        </div>
      </Panel>
      <DataTable items={filtered} columns={columns} getKey={(record) => record.id} />
    </div>
  );
}

function memberName(id: string) {
  return members.find((member) => member.id === id)?.name ?? "Unknown member";
}
