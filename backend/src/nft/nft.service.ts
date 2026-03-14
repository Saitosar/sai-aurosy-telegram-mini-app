import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type {
  TonApiNftCollectionResponse,
  TonApiNftItem,
  TonApiNftItemsResponse,
} from "./nft.types";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const TON_API_BASE = "https://tonapi.io";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable()
export class NftService {
  private readonly tonApiBase: string;
  private readonly tonApiKey: string | undefined;
  private readonly whitelist: Set<string>;
  private readonly displayAddresses: string[];
  private readonly collectionCache = new Map<string, CacheEntry<TonApiNftCollectionResponse>>();
  private readonly itemsCache = new Map<string, CacheEntry<TonApiNftItem[]>>();

  private static readonly DEFAULT_COLLECTION = "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz";

  private static readonly DEFAULT_COLLECTION_RAW =
    "0:b774d95eb20543f186c06b371ab88ad704f7e256130caf96189368a7d0cb6ccf";

  constructor(private readonly config: ConfigService) {
    this.tonApiBase = this.config.get<string>("TON_API_BASE_URL") ?? TON_API_BASE;
    this.tonApiKey = this.config.get<string>("TON_API_KEY");
    const list = this.config.get<string>("NFT_COLLECTION_WHITELIST") ?? "";
    const addrs = list
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    if (addrs.length === 0) {
      addrs.push(NftService.DEFAULT_COLLECTION);
    }
    this.displayAddresses = addrs;
    const normalized = addrs.map((a) => a.toLowerCase());
    this.whitelist = new Set(normalized);
    if (addrs.length === 1 && addrs[0] === NftService.DEFAULT_COLLECTION) {
      this.whitelist.add(NftService.DEFAULT_COLLECTION_RAW);
    }
  }

  private normalizeAddress(addr: string): string {
    return addr.trim().toLowerCase();
  }

  isWhitelisted(address: string): boolean {
    if (this.whitelist.size === 0) return true;
    return this.whitelist.has(this.normalizeAddress(address));
  }

  private async fetch<T>(path: string): Promise<T> {
    const url = `${this.tonApiBase}${path}`;
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (this.tonApiKey) {
      headers["Authorization"] = `Bearer ${this.tonApiKey}`;
    }
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`TonAPI error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  }

  private toRawAddress(addr: string): string {
    if (addr.startsWith("0:")) return addr;
    return addr;
  }

  async getCollection(address: string): Promise<TonApiNftCollectionResponse | null> {
    const normalized = this.normalizeAddress(address);
    if (!this.isWhitelisted(address)) return null;

    const cacheKey = `collection:${normalized}`;
    const cached = this.collectionCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    try {
      const raw = this.toRawAddress(address);
      const data = await this.fetch<TonApiNftCollectionResponse>(
        `/v2/nfts/collections/${encodeURIComponent(raw)}`
      );
      this.collectionCache.set(cacheKey, {
        data,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return data;
    } catch {
      return null;
    }
  }

  async getCollectionItems(
    collectionAddress: string,
    limit = 24,
    offset = 0
  ): Promise<TonApiNftItem[]> {
    if (!this.isWhitelisted(collectionAddress)) return [];

    const cacheKey = `items:${this.normalizeAddress(collectionAddress)}:${limit}:${offset}`;
    const cached = this.itemsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    try {
      const raw = this.toRawAddress(collectionAddress);
      const data = await this.fetch<TonApiNftItemsResponse>(
        `/v2/nfts/collections/${encodeURIComponent(raw)}/items?limit=${limit}&offset=${offset}`
      );
      const items = (data.nft_items ?? []).filter((item) => {
        if (item.trust === "blacklist") return false;
        return true;
      });
      this.itemsCache.set(cacheKey, {
        data: items,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return items;
    } catch {
      return [];
    }
  }

  async getNftItem(nftAddress: string): Promise<TonApiNftItem | null> {
    try {
      const raw = this.toRawAddress(nftAddress);
      const data = await this.fetch<TonApiNftItem>(`/v2/nfts/${encodeURIComponent(raw)}`);
      if (data.trust === "blacklist") return null;
      const collectionAddr = data.collection?.address;
      if (collectionAddr && !this.isWhitelisted(collectionAddr)) return null;
      return data;
    } catch {
      return null;
    }
  }

  getWhitelistedCollections(): string[] {
    return [...this.displayAddresses];
  }
}
