import { Module } from '@nestjs/common';
import { BankingController } from './banking.controller';
import { BankingService } from './banking.service'
import { BankAccountTransaction } from 'src/entities/bank-account-transaction.entity';
import { Bank } from 'src/entities/bank.entity';
import { BankAccount } from 'src/entities/bank-account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bank, BankAccount, BankAccountTransaction]),],
  controllers: [BankingController],
  providers: [BankingService],
})
export class BankingModule {}
