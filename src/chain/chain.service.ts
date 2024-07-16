import { Injectable, Logger } from '@nestjs/common';
import { Block } from 'src/classes/block';

@Injectable()
export class ChainService {
  private logger = new Logger('ChainService');
  public chain = [];
  public difficulty = 5;
  generateGenesisBlock() {
    const date = new Date();
    this.logger.log('Generating Genesis Block');
    return new Block(0, date, 'Genesis Block', '0');
  }
  getLastBlock(): Block {
    return this.chain.slice(-1)[0];
  }
  /* generateBlock(data) {
    const lastBlock: Block = this.getLastBlock();
    const index = lastBlock.index + 1;
    const timestamp = new Date();
    const previousHash = lastBlock.hash;
    return new Block(index, timestamp, data, previousHash);
  } */
  addBlock(block) {
    this.chain.push(block);
    return this.chain;
  }
  isValidChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
  verifyBlock(block: Block) {
    /* if (block.index !== this.getLastBlock().index + 1) {
      console.log('Invalid index', block.index, this.getLastBlock().index);
      return false;
    }
    if (block.previousHash !== this.getLastBlock().hash) {
      console.log('Invalid previous hash');
      return false;
    } */
    const regex = new RegExp(`^0{${this.difficulty}}`);

    if (!regex.test(block.hash)) {
      console.log('Invalid hash');
      return false;
    }
    return true;
  }
}
