export class Block {
  index: number;
  timestamp: Date;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;

  constructor(
    index: number,
    timestamp: Date,
    data: string,
    previousHash: string,
    hash: string,
    nonce: number,
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = hash;
    this.nonce = nonce;
  }
}
