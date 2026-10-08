"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HolographicSurface } from "@/components/ui/holographic-surface";
import { FormField, SelectField, TextAreaField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { gymClasses as seedClasses, trainers } from "@/lib/mock-data";
import { includesQuery } from "@/lib/utils";
import type { ClassStatus, GymClass } from "@/types";

const emptyClass: GymClass = { id: "", name: "", trainerId: trainers[0]?.id ?? "", description: "", schedule: "", durationMinutes: 45, capacity: 12, enrolled: 0, status: "Scheduled" };

export default function ClassesPage() {
  const [classes, setClasses] = useState(seedClasses);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<GymClass | null>(null);
  const { showToast } = useToast();
  const filtered = useMemo(() => classes.filter((item) => includesQuery([item.name, item.schedule, item.status], query)), [classes, query]);

  function save(item: GymClass) {
    if (!item.id) setClasses((current) => [{ ...item, id: `C-${Math.floor(10 + Math.random() * 89)}` }, ...current]);
    else setClasses((current) => current.map((record) => (record.id === item.id ? item : record)));
    showToast({ type: "success", title: item.id ? "Class updated" : "Class created" });
    setEditing(null);
  }

  return (
    <div className="grid gap-6">
      <PageHeader title="Gym Classes" description="Plan class schedules, capacity, trainer assignment, and availability status." action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing(emptyClass)}>Create class</Button>} />
      <Panel><SearchInput value={query} onChange={setQuery} placeholder="Search classes" /></Panel>
      <section className="grid gap-4 lg:grid-cols-2">
        {filtered.map((item) => (
          <article data-reveal key={item.id} className="adapt-panel adapt-stat rounded-adapt border border-adapt-muted bg-adapt-surface p-6 shadow-panel">
            <HolographicSurface tilt />
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3"><span className="grid h-11 w-11 place-items-center rounded-adapt bg-sky-300/15 text-sky-200"><CalendarClock className="h-5 w-5" /></span><div><h2 className="text-xl font-semibold">{item.name}</h2><p className="mt-1 text-sm text-adapt-subtle">{item.schedule} · {item.durationMinutes} min</p></div></div>
              <StatusBadge label={item.status} />
            </div>
            <p className="mt-4 text-sm leading-6 text-adapt-subtle">{item.description}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#12141A]"><div className="h-full rounded-full bg-adapt-primary" style={{ width: `${Math.min(100, (item.enrolled / item.capacity) * 100)}%` }} /></div>
            <div className="mt-2 flex justify-between text-xs text-adapt-subtle"><span>{item.enrolled}/{item.capacity} enrolled</span><span>{trainers.find((trainer) => trainer.id === item.trainerId)?.name}</span></div>
            <div className="mt-5 flex gap-2"><Button variant="secondary" icon={<Pencil className="h-4 w-4" />} onClick={() => setEditing(item)}>Edit</Button><Button variant="ghost" icon={<Trash2 className="h-4 w-4" />} onClick={() => { setClasses((current) => current.filter((record) => record.id !== item.id)); showToast({ title: "Class deleted" }); }} aria-label="Delete class" /></div>
          </article>
        ))}
      </section>
      <ClassForm key={editing ? editing.id || "new-class" : "closed-class"} item={editing} onClose={() => setEditing(null)} onSave={save} />
    </div>
  );
}

function ClassForm({ item, onClose, onSave }: { item: GymClass | null; onClose: () => void; onSave: (item: GymClass) => void }) {
  const [draft, setDraft] = useState(item ?? emptyClass);
  if (!item) return null;
  return (
    <Modal open={Boolean(item)} title={item.id ? "Edit class" : "Create class"} onClose={onClose}>
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
        <FormField label="Class name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <SelectField label="Trainer" value={draft.trainerId} onChange={(event) => setDraft({ ...draft, trainerId: event.target.value })}>{trainers.map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.name}</option>)}</SelectField>
        <TextAreaField label="Description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
        <FormField label="Schedule" value={draft.schedule} onChange={(event) => setDraft({ ...draft, schedule: event.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2"><FormField label="Duration minutes" type="number" value={draft.durationMinutes} onChange={(event) => setDraft({ ...draft, durationMinutes: Number(event.target.value) })} /><FormField label="Capacity" type="number" value={draft.capacity} onChange={(event) => setDraft({ ...draft, capacity: Number(event.target.value) })} /></div>
        <SelectField label="Status" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as ClassStatus })}><option>Scheduled</option><option>Full</option><option>Cancelled</option><option>Inactive</option></SelectField>
        <div className="flex justify-end gap-3"><Button variant="secondary" type="button" onClick={onClose}>Cancel</Button><Button type="submit">Save class</Button></div>
      </form>
    </Modal>
  );
}
