import * as crypto from 'crypto';

export class Transaction {
  sender: string;
  recipient: string;
  amount: number;
  hash: string;
  signature: string;
  timestamp: Date;
  constructor(
    sender: string,
    recipient: string,
    amount: number,
    signature: string,
    timestamp: Date,
  ) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
    this.hash = this.createHash(sender, recipient, amount, timestamp);
    this.signature = signature;
    this.timestamp = timestamp;
  }
  createHash(
    sender: string,
    recipient: string,
    amount: number,
    timestamp: Date,
  ) {
    const hash = crypto
      .createHash('sha256')
      .update(sender + recipient + amount + timestamp)
      .digest('hex');
    return hash;
  }
}
