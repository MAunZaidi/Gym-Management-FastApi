"use client";

import { useMemo, useState } from "react";
import { Check, Eye, Pencil, Plus, Power, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HolographicSurface } from "@/components/ui/holographic-surface";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField, TextAreaField, ToggleField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { membershipPlans as seedPlans } from "@/lib/mock-data";
import { formatCurrency, includesQuery } from "@/lib/utils";
import type { MembershipPlan } from "@/types";

const emptyPlan: MembershipPlan = {
  id: "",
  name: "",
  durationDays: 30,
  price: 0,
  description: "",
  features: ["Gym floor access"],
  active: true
};

export default function MembershipPlansPage() {
  const [plans, setPlans] = useState(seedPlans);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<MembershipPlan | null>(null);
  const [viewing, setViewing] = useState<MembershipPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MembershipPlan | null>(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => plans.filter((plan) => includesQuery([plan.name, plan.description, plan.price], query)), [plans, query]);

  function savePlan(plan: MembershipPlan) {
    if (!plan.id) {
      const created = { ...plan, id: `P-${Math.floor(10 + Math.random() * 89)}` };
      setPlans((current) => [created, ...current]);
      showToast({ type: "success", title: "Plan created" });
    } else {
      setPlans((current) => current.map((item) => (item.id === plan.id ? plan : item)));
      showToast({ type: "success", title: "Plan updated" });
    }
    setEditing(null);
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Membership Plans"
        description="Shape the gym's commercial offers with plan cards, benefits, pricing, and active status."
        action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setEditing(emptyPlan)}>Create plan</Button>}
      />
      <Panel>
        <SearchInput value={query} onChange={setQuery} placeholder="Search plans" />
      </Panel>
      {filtered.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((plan) => (
            <article data-reveal key={plan.id} className="adapt-panel adapt-plan group rounded-adapt border border-adapt-muted bg-adapt-surface p-6 shadow-panel">
              <HolographicSurface tilt />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <StatusBadge label={plan.active ? "Active" : "Inactive"} />
                  <h2 className="mt-4 text-2xl font-semibold">{plan.name}</h2>
                </div>
                <p className="text-right text-3xl font-semibold">{formatCurrency(plan.price)}</p>
              </div>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-adapt-subtle">{plan.durationDays} days</p>
              <p className="mt-4 min-h-12 text-sm leading-6 text-adapt-subtle">{plan.description}</p>
              <ul className="mt-5 grid gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-zinc-200">
                    <Check className="h-4 w-4 text-adapt-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="secondary" icon={<Eye className="h-4 w-4" />} onClick={() => setViewing(plan)}>View</Button>
                <Button variant="secondary" icon={<Pencil className="h-4 w-4" />} onClick={() => setEditing(plan)}>Edit</Button>
                <Button
                  variant="secondary"
                  icon={<Power className="h-4 w-4" />}
                  onClick={() => {
                    setPlans((current) => current.map((item) => (item.id === plan.id ? { ...item, active: !item.active } : item)));
                    showToast({ title: plan.active ? "Plan deactivated" : "Plan activated" });
                  }}
                >
                  {plan.active ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="ghost" icon={<Trash2 className="h-4 w-4" />} onClick={() => setDeleteTarget(plan)} aria-label="Delete plan" />
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState title="No plans found" description="Create a plan or change the search query." />
      )}
      <PlanForm key={editing ? editing.id || "new-plan" : "closed-plan"} plan={editing} onClose={() => setEditing(null)} onSave={savePlan} />
      <Modal open={Boolean(viewing)} title={viewing?.name ?? "Plan"} description={viewing?.description} onClose={() => setViewing(null)}>
        {viewing ? (
          <div className="grid gap-3">
            <ProfileLine label="Duration" value={`${viewing.durationDays} days`} />
            <ProfileLine label="Price" value={formatCurrency(viewing.price)} />
            <ProfileLine label="Features" value={viewing.features.join(", ")} />
          </div>
        ) : null}
      </Modal>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete plan?"
        description={`Remove ${deleteTarget?.name ?? "this plan"} from available offers.`}
        confirmLabel="Delete plan"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setPlans((current) => current.filter((plan) => plan.id !== deleteTarget.id));
          setDeleteTarget(null);
          showToast({ type: "success", title: "Plan deleted" });
        }}
      />
    </div>
  );
}

function PlanForm({ plan, onClose, onSave }: { plan: MembershipPlan | null; onClose: () => void; onSave: (plan: MembershipPlan) => void }) {
  const [draft, setDraft] = useState(plan ?? emptyPlan);
  if (!plan) return null;

  return (
    <Modal open={Boolean(plan)} title={plan.id ? "Edit plan" : "Create plan"} onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({ ...draft, features: draft.features.filter(Boolean) });
        }}
      >
        <FormField required label="Plan name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField required label="Duration days" type="number" value={draft.durationDays} onChange={(event) => setDraft({ ...draft, durationDays: Number(event.target.value) })} />
          <FormField required label="Price" type="number" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} />
        </div>
        <TextAreaField label="Description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
        <TextAreaField label="Features, one per line" value={draft.features.join("\n")} onChange={(event) => setDraft({ ...draft, features: event.target.value.split("\n") })} />
        <ToggleField label="Active plan" checked={draft.active} onChange={(checked) => setDraft({ ...draft, active: checked })} />
        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save plan</Button>
        </div>
      </form>
    </Modal>
  );
}

function ProfileLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-adapt bg-[#12141A] p-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-adapt-subtle">{label}</p>
      <p className="mt-1 text-sm text-zinc-100">{value}</p>
    </div>
  );
}
