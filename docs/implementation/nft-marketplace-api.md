# NFT Marketplace API

## Overview

The NFT Marketplace uses the NestJS backend as a proxy to TonAPI. All NFT data flows through the backend; the frontend never calls TonAPI directly.

## Backend Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/nft/collections` | List whitelisted collection addresses |
| GET | `/nft/collections/:address` | Get collection metadata |
| GET | `/nft/collections/:address/items` | Paginated NFT items (query: `limit`, `offset`) |
| GET | `/nft/items/:address` | Single NFT item details |

## Query Parameters

### GET /nft/collections/:address/items

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 24 | Items per page (1–100) |
| offset | number | 0 | Pagination offset |

## Response Shapes

### GET /nft/collections

```json
{
  "addresses": ["EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz"]
}
```

### GET /nft/collections/:address

Returns TonAPI collection object: `address`, `metadata`, `previews`, etc.

### GET /nft/collections/:address/items

```json
{
  "nft_items": [
    {
      "address": "0:...",
      "metadata": { "name": "...", "attributes": [...] },
      "previews": [{ "resolution": "500x500", "url": "..." }],
      "sale": { "price": { "value": "1000000000" } },
      "collection": { "address": "...", "name": "..." }
    }
  ]
}
```

### Price Format

- `sale.price.value` is in **nanotons** (1 TON = 10^9 nanotons)
- Frontend converts: `Number(BigInt(value)) / 1e9` for display

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NFT_COLLECTION_WHITELIST` | Comma-separated collection addresses. Empty = demo collection (TON DNS). |
| `TON_API_BASE_URL` | TonAPI base URL (default: `https://tonapi.io`) |
| `TON_API_KEY` | Optional; for higher rate limits |

## Caching

- In-memory cache with 5-minute TTL
- Keys: `collection:{address}`, `items:{address}:{limit}:{offset}`

## Frontend API Client

Location: `frontend/src/api/nft.ts`

| Function | Purpose |
|----------|---------|
| `getNftCollections()` | Fetch whitelisted collection addresses |
| `getNftCollection(address)` | Fetch collection metadata |
| `getNftCollectionItems(address, limit, offset)` | Fetch paginated items |
| `getNftItem(address)` | Fetch single NFT |
| `getNftImageUrl(item, preferredResolution?)` | Get image URL with multi-resolution fallback (500x500, 1500x1500, 100x100, 5x5) and `metadata.image` fallback |
| `buildGetgemsUrl(item)` | Build Getgems Deep Link for Buy button |
| `formatPriceNanoton(nanoton)` | Convert nanotons to "X.XX TON" string |

**BuyButton** (`frontend/src/components/nft/BuyButton.tsx`): Always enabled. Opens Getgems for both "Buy on Getgems" (when NFT has sale) and "View on Getgems" (when not for sale).
