export type StoreItemType = "robot" | "scenario";
export interface StoreItem {
    id: string;
    type: StoreItemType;
    name: string;
    model?: string;
    description: string;
    specs?: string[];
    price?: string;
}
