import { Logger, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChainService } from './chain.service';
import { Server, Socket } from 'socket.io';
import { Block } from 'src/classes/block';
import { BlockStorageService } from 'src/block-storage/block-storage.service';
import { IndexService } from 'src/index/index.service';

@WebSocketGateway()
export class ChainGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger();
  private connectedMiner = 0;
  constructor(
    private readonly chainService: ChainService,
    private readonly blockStorageService: BlockStorageService,
    private readonly indexService: IndexService,
  ) {}

  async onModuleInit() {
    const block = await this.indexService.getLastBlock();
    if (!block) {
      await this.chainService.addBlock(
        this.chainService.generateGenesisBlock(),
      );
    }
  }

  handleConnection(client: Socket) {
    this.connectedMiner++;
    this.logger.log('New Node connected! Total nodes: ' + this.connectedMiner);
    client.emit('getLastBlock', this.chainService.getLastBlock());
    client.emit('difficulty', this.chainService.difficulty);
  }
  handleDisconnect() {
    this.connectedMiner--;
    this.logger.log(
      'Current Length of the chain: ' + this.chainService.chain.length,
    );
    this.logger.log('Node disconnected! Total nodes: ' + this.connectedMiner);
  }
  @SubscribeMessage('newBlock')
  async newBlock(client: Socket, block: Block) {
    const lastBlock = await this.chainService.getLastBlock();
    console.log('lastBlock', lastBlock);
    const newBlock = new Block(
      lastBlock.index + 1,
      new Date(),
      block.data,
      lastBlock.hash,
      block.hash,
      block.nonce,
    );
    if (this.chainService.verifyBlock(newBlock)) {
      this.chainService.addBlock(newBlock);
      this.server.emit('newBlock', newBlock);
      this.difficultyUpdate(newBlock);
      this.server.emit('getDifficulty', this.chainService.difficulty);
    } else {
      client.emit('getLastBlock', this.chainService.getLastBlock());
    }
  }
  @SubscribeMessage('getLastBlock')
  async getLastBlock(client: Socket) {
    const lastBlock = await this.chainService.getLastBlock();
    client.emit('getLastBlock', lastBlock);
  }
  @SubscribeMessage('getDifficulty')
  getDifficulty(client: Socket) {
    client.emit('getDifficulty', this.chainService.difficulty);
  }

  difficultyUpdate(block: Block) {
    if (block.index % 100 === 0) {
      this.chainService.adjustDifficulty();
      this.server.emit('getDifficulty', this.chainService.difficulty);
    }
  }
}
