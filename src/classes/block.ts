import * as crypto from 'crypto';

export class Block {
  index: number;
  timestamp: Date;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;

  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
          this.previousHash +
          this.timestamp +
          JSON.stringify(this.data) +
          this.nonce,
      )
      .digest('hex');
  }

  mineBlock(difficulty) {
    // Define the required pattern of leading zeros based on the difficulty.
    const requiredPattern = Array(difficulty + 1).join('0');

    while (this.hash.substring(0, difficulty) !== requiredPattern) {
      this.nonce++;
      this.hash = this.calculateHash();
      console.log(this.hash, this.nonce);
    }

    console.log('Block mined: ' + this.hash);
  }
}
