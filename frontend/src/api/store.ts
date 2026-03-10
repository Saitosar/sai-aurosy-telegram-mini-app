import { apiFetch } from "./client";
import type { StoreItem } from "shared";

export async function getStoreItems(): Promise<StoreItem[]> {
  return apiFetch<StoreItem[]>("/store/items");
}

export async function getStoreItem(id: string): Promise<StoreItem> {
  return apiFetch<StoreItem>(`/store/items/${id}`);
}

export async function acquireItem(id: string): Promise<void> {
  await apiFetch(`/store/items/${id}/acquire`, { method: "POST" });
}
