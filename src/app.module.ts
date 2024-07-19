import { Module } from '@nestjs/common';
import { ChainService } from './chain/chain.service';
import { ChainGateway } from './chain/chain.gateway';
import { TransactionModule } from './transaction/transaction.module';
import { ChainModule } from './chain/chain.module';
import { BlockStorageService } from './block-storage/block-storage.service';
import { IndexService } from './index/index.service';

@Module({
  imports: [TransactionModule, ChainModule],
  controllers: [],
  providers: [ChainService, ChainGateway, BlockStorageService, IndexService],
})
export class AppModule {}
