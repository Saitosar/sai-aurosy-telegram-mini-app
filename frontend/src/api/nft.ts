import { Address } from "@ton/core";
import { apiFetch } from "./client";

export interface NftPreview {
  resolution: string;
  url: string;
}

export interface NftMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  [key: string]: unknown;
}

export interface NftSalePrice {
  value: string;
  token_name?: string;
}

export interface NftSale {
  address: string;
  market: { address: string; name: string };
  price: NftSalePrice;
}

export interface NftCollectionRef {
  address: string;
  name?: string;
  description?: string;
}

export interface NftItem {
  address: string;
  index?: number;
  owner?: { address: string; name?: string; is_scam?: boolean; is_wallet?: boolean };
  collection?: NftCollectionRef;
  verified?: boolean;
  metadata?: NftMetadata;
  previews?: NftPreview[];
  sale?: NftSale;
  trust?: "whitelist" | "graylist" | "blacklist";
  [key: string]: unknown;
}

export interface NftCollection {
  address: string;
  next_item_index?: number;
  metadata?: NftMetadata;
  previews?: NftPreview[];
  approved_by?: string[];
  [key: string]: unknown;
}

export interface NftCollectionsResponse {
  addresses: string[];
}

export interface NftItemsResponse {
  nft_items: NftItem[];
}

export function formatPriceNanoton(nanoton: string): string {
  const ton = Number(BigInt(nanoton)) / 1e9;
  return ton.toLocaleString("en-US", { maximumFractionDigits: 4 }) + " TON";
}

export function getNftImageUrl(item: NftItem, resolution = "500x500"): string | undefined {
  return item.previews?.find((p) => p.resolution === resolution)?.url;
}

export function getNftName(item: NftItem): string {
  return item.metadata?.name ?? item.address;
}

function toFriendlyAddress(addr: string): string {
  try {
    return Address.parse(addr).toString({ urlSafe: true, bounceable: false });
  } catch {
    return addr;
  }
}

export function buildGetgemsUrl(item: NftItem): string {
  const nftAddr = toFriendlyAddress(item.address);
  const base = "https://getgems.io";
  const params = new URLSearchParams({ modalId: "nft_buy", modalNft: nftAddr });
  if (item.collection?.address) {
    const collAddr = toFriendlyAddress(item.collection.address);
    return `${base}/collection/${collAddr}/${nftAddr}?${params}`;
  }
  return `${base}/nft/${nftAddr}?${params}`;
}

export async function getNftCollections(): Promise<NftCollectionsResponse> {
  return apiFetch<NftCollectionsResponse>("/nft/collections");
}

export async function getNftCollection(address: string): Promise<NftCollection> {
  return apiFetch<NftCollection>(`/nft/collections/${encodeURIComponent(address)}`);
}

export async function getNftCollectionItems(
  collectionAddress: string,
  limit = 24,
  offset = 0
): Promise<NftItemsResponse> {
  return apiFetch<NftItemsResponse>(
    `/nft/collections/${encodeURIComponent(collectionAddress)}/items?limit=${limit}&offset=${offset}`
  );
}

export async function getNftItem(address: string): Promise<NftItem> {
  return apiFetch<NftItem>(`/nft/items/${encodeURIComponent(address)}`);
}
