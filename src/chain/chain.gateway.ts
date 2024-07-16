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

@WebSocketGateway()
export class ChainGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger();
  private connectedMiner = 0;
  constructor(private readonly chainService: ChainService) {}

  onModuleInit() {
    this.chainService.addBlock(this.chainService.generateGenesisBlock());
  }

  handleConnection(client: Socket) {
    this.connectedMiner++;
    this.logger.log('New Node connected! Total nodes: ' + this.connectedMiner);
    client.emit(
      'chain' /* this.chainService.getChain() - emitting current chain state to the node */,
    );
  }
  handleDisconnect() {
    this.connectedMiner--;
    this.logger.log(
      'Current Length of the chain: ' + this.chainService.chain.length,
    );
    this.logger.log('Node disconnected! Total nodes: ' + this.connectedMiner);
  }
  @SubscribeMessage('newBlock')
  newBlock(client: Socket, block: Block) {
    if (this.chainService.verifyBlock(block)) {
      this.chainService.addBlock(block);
      this.server.emit('newBlock', block);
    }
  }
  @SubscribeMessage('getLastBlock')
  getLastBlock(client: Socket) {
    const lastBlock = this.chainService.getLastBlock();
    client.emit('getLastBlock', lastBlock);
  }
  @SubscribeMessage('getDifficulty')
  getDifficulty(client: Socket) {
    client.emit('getDifficulty', this.chainService.difficulty);
  }
}
