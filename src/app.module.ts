import { Module } from '@nestjs/common';
import {BankingModule} from './banking-system/banking.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { BankAccountTransaction } from './entities/bank-account-transaction.entity';
import { BankAccount } from './entities/bank-account.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    password: '5325',
    username: 'postgres',
    entities: [Bank,BankAccount,BankAccountTransaction],
    database: 'banking-system',
    synchronize: true,
    logging: true,
  }),
  BankingModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}
