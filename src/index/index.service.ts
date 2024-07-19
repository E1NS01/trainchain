import { Injectable } from '@nestjs/common';
import { Level } from 'level';

@Injectable()
export class IndexService {
  private db: Level;
  private lastHash = 'lastEntryKey';

  constructor() {
    this.db = new Level('./blockchain-index');
  }

  async addBlockIndex(hash: string, fileNumber: number, offset: number) {
    await this.db.put(`block:${hash}`, JSON.stringify({ fileNumber, offset }));
    await this.db.put(this.lastHash, hash);
  }
  async getBlockLocation(
    hash: string,
  ): Promise<{ fileNumber: number; offset: number }> {
    const location = await this.db.get(`block:${hash}`);
    return JSON.parse(location);
  }

  async getLastBlock(): Promise<any> {
    try {
      const lastHash = await this.db.get(this.lastHash);
      const location = await this.db.get(`block:${lastHash}`);
      return JSON.parse(location);
    } catch (error) {
      if (error.notFound) {
        return null;
      }
      throw error;
    }
  }

  //addTxindex
  //getTxBlockhash
}
