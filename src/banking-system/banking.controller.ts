import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { BankingService } from './banking.service';
import { CreateBankAccountTransactionDto } from '../dtos/bank-account-transaction.dto';
import { CreateBankDto } from 'src/dtos/bank.dto';
import { CreateBankAccountDto } from 'src/dtos/bank-account.dto';

@Controller('bank')
export class BankingController {
  constructor(private readonly bankingService: BankingService) { }

  @Post('createBank')
  async createBank(@Body() createBank: CreateBankDto) {
    return this.bankingService.createBank(createBank);
  }

  @Post('createAccount')
  async createAccount(@Body() createBankAccount: CreateBankAccountDto) {
    return this.bankingService.createBankAccount(createBankAccount);
  }

  @Post('transaction')
  async createTransaction(@Body() createTransactionDto: CreateBankAccountTransactionDto) {
    return this.bankingService.createTransactionAndAdjustBalance(createTransactionDto);
  }

  @Get('transaction/:id')
  async getTransactionById(@Param('id') transactionId: number) {
    try {
      const transaction = await this.bankingService.getTransactionById(transactionId);
      return { transaction };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  ///oneAccToOther
  @Post('account/:id')
  async Transfer(@Param('id') accountId: number,
    @Body() createTransactionDto: CreateBankAccountTransactionDto) {
    try {
      const transfer = await this.bankingService.Transfer(accountId, createTransactionDto);
      return { transfer };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
