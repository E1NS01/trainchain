import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Block } from 'src/classes/block';

@Injectable()
export class BlockStorageService {
  private readonly blockDir = './blockchain';
  currentFile: number = 0;
  currentFileSize: number = 0;
  private readonly maxFileSize: number = 128 * 1024 * 1024; // 128MB
  private lastBlock: Block;

  constructor() {
    if (!fs.existsSync(this.blockDir)) {
      fs.mkdirSync(this.blockDir);
    }
    this.currentFile = this.getLatestFileNumber();
  }
  private getLatestFileNumber(): number {
    const files = fs.readdirSync(this.blockDir);
    return files.length > 0
      ? Math.max(...files.map((f) => parseInt(f.split('.')[0])))
      : 0;
  }
  async appendBlock(block: Block) {
    const blockData = JSON.stringify(block) + '\n';
    const fileName = `${this.blockDir}/${this.currentFile}.dat`;
    if (this.currentFileSize + blockData.length > this.maxFileSize) {
      this.currentFile++;
      this.currentFileSize = 0;
    }
    await fs.promises.appendFile(fileName, blockData);
    this.currentFileSize += blockData.length + 1;
    this.lastBlock = block;
  }
  async getBlock(fileNumber: number, offset: number): Promise<Block> {
    const fileName = `${this.blockDir}/${fileNumber}.dat`;
    const fileContent = await fs.promises.readFile(fileName, 'utf-8');
    const block = fileContent.split('\n');
    return JSON.parse(block[offset]);
  }
  getLastBlock(): Block {
    if (!this.lastBlock) {
      this.loadLastBlock();
    }
    return this.lastBlock;
  }
  private loadLastBlock(): void {
    const fileName = `${this.blockDir}/${this.currentFile}.dat`;
    if (fs.existsSync(fileName)) {
      const content = fs.readFileSync(fileName, 'utf8');
      const blocks = content.trim().split('\n');
      if (blocks.length > 0) {
        this.lastBlock = JSON.parse(blocks[blocks.length - 1]);
      }
    }
  }
}
