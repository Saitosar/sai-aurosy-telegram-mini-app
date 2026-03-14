import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ConditionalAuthGuard } from "../auth/auth.guard";
import { NftService } from "./nft.service";

@Controller("nft")
@UseGuards(ConditionalAuthGuard)
export class NftController {
  constructor(private readonly nft: NftService) {}

  @Get("collections")
  async listCollections(): Promise<{ addresses: string[] }> {
    const addresses = this.nft.getWhitelistedCollections();
    return { addresses };
  }

  @Get("collections/:address")
  async getCollection(@Param("address") address: string) {
    const collection = await this.nft.getCollection(address);
    if (!collection) throw new NotFoundException("Collection not found");
    return collection;
  }

  @Get("collections/:address/items")
  async getCollectionItems(
    @Param("address") address: string,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string
  ) {
    const limitNum = Math.min(Math.max(parseInt(limit ?? "24", 10) || 24, 1), 100);
    const offsetNum = Math.max(parseInt(offset ?? "0", 10) || 0, 0);
    const items = await this.nft.getCollectionItems(address, limitNum, offsetNum);
    return { nft_items: items };
  }

  @Get("items/:address")
  async getNftItem(@Param("address") address: string) {
    const item = await this.nft.getNftItem(address);
    if (!item) throw new NotFoundException("NFT item not found");
    return item;
  }
}
