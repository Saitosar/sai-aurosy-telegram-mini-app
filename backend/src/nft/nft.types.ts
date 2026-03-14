/**
 * Types for TonAPI NFT responses.
 * @see https://docs.tonapi.io/tonapi/rest-api/nft
 */

export interface TonApiNftPreview {
  resolution: string;
  url: string;
}

export interface TonApiNftMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  [key: string]: unknown;
}

export interface TonApiSalePrice {
  value: string;
  token_name?: string;
}

export interface TonApiSale {
  address: string;
  market: { address: string; name: string };
  price: TonApiSalePrice;
}

export interface TonApiNftOwner {
  address: string;
  name?: string;
  is_scam?: boolean;
  is_wallet?: boolean;
}

export interface TonApiNftCollection {
  address: string;
  name?: string;
  description?: string;
}

export interface TonApiNftItem {
  address: string;
  index?: number;
  owner?: TonApiNftOwner;
  collection?: TonApiNftCollection;
  verified?: boolean;
  metadata?: TonApiNftMetadata;
  previews?: TonApiNftPreview[];
  sale?: TonApiSale;
  trust?: "whitelist" | "graylist" | "blacklist";
  approved_by?: string[];
  [key: string]: unknown;
}

export interface TonApiNftCollectionResponse {
  address: string;
  next_item_index?: number;
  raw_collection_content?: string;
  metadata?: TonApiNftMetadata;
  previews?: TonApiNftPreview[];
  approved_by?: string[];
  [key: string]: unknown;
}

export interface TonApiNftItemsResponse {
  nft_items: TonApiNftItem[];
}
