import { Injectable, Logger } from '@nestjs/common';
import { BlockStorageService } from 'src/block-storage/block-storage.service';
import { Block } from 'src/classes/block';
import { IndexService } from 'src/index/index.service';
import * as crypto from 'crypto';

@Injectable()
export class ChainService {
  private logger = new Logger('ChainService');
  public chain = [];
  public difficulty = 1;
  public checkBlock = this.getLastBlock();

  constructor(
    private blockStorage: BlockStorageService,
    private indexService: IndexService,
  ) {}

  generateGenesisBlock() {
    const date = new Date();
    this.logger.log('Generating Genesis Block');
    const hash = crypto.createHash('sha256').update('Genesis').digest('hex');
    const dataHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ type: 'Genesis' }))
      .digest('hex');
    return new Block(0, date, dataHash, hash, hash, 0);
  }
  getLastBlock(): Block {
    return this.blockStorage.getLastBlock();
  }
  async addBlock(block) {
    await this.blockStorage.appendBlock(block);

    const blockLocation = {
      fileNumber: this.blockStorage.currentFile,
      offset: this.blockStorage.currentFileSize,
    };
    await this.indexService.addBlockIndex(
      block.hash,
      blockLocation.fileNumber,
      blockLocation.offset,
    );
  }
  isValidChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
  async verifyBlock(block: Block) {
    const lastBlock = await this.getLastBlock();
    if (block.index !== lastBlock.index + 1) {
      return false;
    }
    if (block.previousHash !== lastBlock.hash) {
      return false;
    }
    const regex = new RegExp(`^0{${this.difficulty}}`);

    if (!regex.test(block.hash)) {
      return false;
    }
    return true;
  }

  async adjustDifficulty() {
    const lastBlock = await this.getLastBlock();

    if (
      Number(lastBlock.timestamp) - Number(this.checkBlock.timestamp) <
      200000
    ) {
      this.difficulty++;
      this.logger.log('Difficulty increased to ' + this.difficulty);
    } else {
      console.log(Number(lastBlock.timestamp) - Number(this.checkBlock));
      this.difficulty--;
      this.logger.log('Difficulty decreased to ' + this.difficulty);
    }
    this.checkBlock = lastBlock;
  }
}
