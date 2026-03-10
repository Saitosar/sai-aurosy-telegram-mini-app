/**
 * Store DTOs - shared between frontend and backend.
 * Aligned with docs/architecture/data-model.md and docs/api/api-overview.md
 */

export type StoreItemType = "robot" | "scenario";

export interface StoreItem {
  id: string;
  type: StoreItemType;
  name: string;
  model?: string;
  description: string;
  specs?: string[];
  price?: string;
  imageUrl?: string;
}
