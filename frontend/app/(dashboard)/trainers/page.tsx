"use client";

import { useMemo, useState } from "react";
import { Dumbbell, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HolographicSurface } from "@/components/ui/holographic-surface";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormField, SelectField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { gymClasses, members, trainers as seedTrainers } from "@/lib/mock-data";
import { includesQuery } from "@/lib/utils";
import type { Trainer, TrainerStatus } from "@/types";

const emptyTrainer: Trainer = {
  id: "",
  name: "",
  email: "",
  phone: "",
  specialization: "",
  availability: "",
  status: "Available",
  assignedMemberIds: [],
  assignedClassIds: []
};

export default function TrainersPage() {
  const [trainers, setTrainers] = useState(seedTrainers);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [viewing, setViewing] = useState<Trainer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Trainer | null>(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => trainers.filter((trainer) => includesQuery([trainer.name, trainer.specialization, trainer.status], query)), [query, trainers]);

  function save(trainer: Trainer) {
    if (!trainer.id) {
      setTrainers((current) => [{ ...trainer, id: `T-${Math.floor(10 + Math.random() * 89)}` }, ...current]);
      showToast({ type: "success", title: "Trainer created" });
    } else {
      setTrainers((current) => current.map((item) => (item.id === trainer.id ? trainer : item)));
      showToast({ type: "success", title: "Trainer updated" });
    }
    setEditing(null);
  }

  return (
    <div className="grid gap-6">
      <PageHeader title="Trainers" description="Manage trainer contact details, specializations, availability, assigned members, and classes." action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing(emptyTrainer)}>Add trainer</Button>} />
      <Panel><SearchInput value={query} onChange={setQuery} placeholder="Search trainers" /></Panel>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((trainer) => (
          <article data-reveal key={trainer.id} className="adapt-panel adapt-stat rounded-adapt border border-adapt-muted bg-adapt-surface p-6 shadow-panel">
            <HolographicSurface tilt />
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-adapt bg-adapt-primary/15 text-indigo-300"><Dumbbell className="h-5 w-5" /></span>
              <StatusBadge label={trainer.status} />
            </div>
            <h2 className="mt-5 text-xl font-semibold">{trainer.name}</h2>
            <p className="mt-1 text-sm text-adapt-subtle">{trainer.specialization} · {trainer.availability}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric label="Members" value={String(trainer.assignedMemberIds.length)} />
              <Metric label="Classes" value={String(trainer.assignedClassIds.length)} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="secondary" icon={<Eye className="h-4 w-4" />} onClick={() => setViewing(trainer)}>Profile</Button>
              <Button variant="secondary" icon={<Pencil className="h-4 w-4" />} onClick={() => setEditing(trainer)}>Edit</Button>
              <Button variant="ghost" icon={<Trash2 className="h-4 w-4" />} onClick={() => setDeleteTarget(trainer)} aria-label="Delete trainer" />
            </div>
          </article>
        ))}
      </section>
      <TrainerForm key={editing ? editing.id || "new-trainer" : "closed-trainer"} trainer={editing} onClose={() => setEditing(null)} onSave={save} />
      <Modal open={Boolean(viewing)} title={viewing?.name ?? "Trainer"} description={viewing?.specialization} onClose={() => setViewing(null)}>
        {viewing ? (
          <div className="grid gap-3">
            <p className="text-sm text-adapt-subtle">{viewing.email} · {viewing.phone}</p>
            <p className="text-sm text-zinc-200">Assigned members: {viewing.assignedMemberIds.map((id) => members.find((item) => item.id === id)?.name).filter(Boolean).join(", ") || "None"}</p>
            <p className="text-sm text-zinc-200">Classes: {viewing.assignedClassIds.map((id) => gymClasses.find((item) => item.id === id)?.name).filter(Boolean).join(", ") || "None"}</p>
          </div>
        ) : null}
      </Modal>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete trainer?"
        description={`Remove ${deleteTarget?.name ?? "this trainer"} from trainer records.`}
        confirmLabel="Delete trainer"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setTrainers((current) => current.filter((trainer) => trainer.id !== deleteTarget.id));
          setDeleteTarget(null);
          showToast({ type: "success", title: "Trainer deleted" });
        }}
      />
    </div>
  );
}

function TrainerForm({ trainer, onClose, onSave }: { trainer: Trainer | null; onClose: () => void; onSave: (trainer: Trainer) => void }) {
  const [draft, setDraft] = useState(trainer ?? emptyTrainer);
  if (!trainer) return null;
  return (
    <Modal open={Boolean(trainer)} title={trainer.id ? "Edit trainer" : "Add trainer"} onClose={onClose}>
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
        <FormField label="Name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <FormField label="Email" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
        <FormField label="Phone" type="tel" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
        <FormField label="Specialization" value={draft.specialization} onChange={(event) => setDraft({ ...draft, specialization: event.target.value })} />
        <FormField label="Availability" value={draft.availability} onChange={(event) => setDraft({ ...draft, availability: event.target.value })} />
        <SelectField label="Status" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as TrainerStatus })}>
          <option>Available</option>
          <option>Busy</option>
          <option>Inactive</option>
        </SelectField>
        <div className="flex justify-end gap-3"><Button variant="secondary" type="button" onClick={onClose}>Cancel</Button><Button type="submit">Save trainer</Button></div>
      </form>
    </Modal>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-adapt bg-[#12141A] p-3"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-adapt-subtle">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p></div>;
}
