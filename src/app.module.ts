import { Module } from '@nestjs/common';
import { ChainService } from './chain/chain.service';
import { BlockService } from './block/block.service';
import { ChainGateway } from './chain/chain.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ChainService, BlockService, ChainGateway],
})
export class AppModule {}
