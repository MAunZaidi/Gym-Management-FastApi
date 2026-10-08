export type PublicPlan = {
  id: number;
  name: string;
  duration: string;
  price: number;
  description: string;
};

export type PublicTrainer = {
  id: number;
  name: string;
  specialization: string;
};

export type PublicClass = {
  id: number;
  name: string;
  trainerId: number;
  day: string;
  startTime: string;
  durationMinutes: number;
  capacity: number;
};

export type CatalogResult<T> = { items: T[]; unavailable: boolean };

type ApiPlan = { id: number; name: string; duration: string; price: number; decription?: string; is_active: boolean };
type ApiTrainer = { id: number; name: string; specialization: string; is_active: boolean };
type ApiClass = { id: number; name: string; trainer_id: number; day_of_week: string; start_time: string; duration_min: number; capacity: number };

const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function readCatalog<T>(path: string): Promise<CatalogResult<T>> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
    const items = (await response.json()) as T[];
    return { items, unavailable: false };
  } catch {
    return { items: [], unavailable: true };
  }
}

export async function getPublicPlans(): Promise<CatalogResult<PublicPlan>> {
  const result = await readCatalog<ApiPlan>("/plan");
  return {
    unavailable: result.unavailable,
    items: result.items.filter((plan) => plan.is_active).map((plan) => ({
      id: plan.id,
      name: plan.name,
      duration: plan.duration,
      price: plan.price,
      description: plan.decription ?? ""
    }))
  };
}

export async function getPublicTrainers(): Promise<CatalogResult<PublicTrainer>> {
  const result = await readCatalog<ApiTrainer>("/trainers");
  return {
    unavailable: result.unavailable,
    items: result.items.filter((trainer) => trainer.is_active).map((trainer) => ({
      id: trainer.id,
      name: trainer.name,
      specialization: trainer.specialization
    }))
  };
}

export async function getPublicClasses(): Promise<CatalogResult<PublicClass>> {
  const result = await readCatalog<ApiClass>("/gym-class");
  return {
    unavailable: result.unavailable,
    items: result.items.map((gymClass) => ({
      id: gymClass.id,
      name: gymClass.name,
      trainerId: gymClass.trainer_id,
      day: gymClass.day_of_week,
      startTime: gymClass.start_time,
      durationMinutes: gymClass.duration_min,
      capacity: gymClass.capacity
    }))
  };
}

export function formatClassTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return value;
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
}
