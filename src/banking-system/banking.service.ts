import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccountTransaction } from '../entities/bank-account-transaction.entity';
import { CreateBankAccountTransactionDto } from '../dtos/bank-account-transaction.dto';
import { CreateBankDto } from 'src/dtos/bank.dto';
import { Bank } from 'src/entities/bank.entity';
import { BankAccount } from 'src/entities/bank-account.entity';
import { BankAccountDto, CreateBankAccountDto } from 'src/dtos/bank-account.dto';
import { OpenExchangeRates } from 'open-exchange-rates';
import axios from 'axios';

const ratesApiUrl='https://openexchangerates.org/api/latest.json?app_id=f9c7dde9fab04083a189b92f7bd91fb3';


@Injectable()

export class BankingService {
    private readonly openExchangeRates: OpenExchangeRates;
    

    constructor(
        @InjectRepository(Bank)
        private bankRepository: Repository<Bank>,
        @InjectRepository(BankAccount)
        private bankAccountRepository: Repository<BankAccount>,
        @InjectRepository(BankAccountTransaction)
        private transactionsRepository: Repository<BankAccountTransaction>,
    ) {}

    async createBank(CreateBankDto: CreateBankDto): Promise<Bank> {
        const newBank = this.bankRepository.create(CreateBankDto);
        return await this.bankRepository.save(newBank);
    }

    async createBankAccount(CreateBankAccountDto: CreateBankAccountDto): Promise<BankAccount> {
        const newAccount = this.bankAccountRepository.create(CreateBankAccountDto);
        return await this.bankAccountRepository.save(newAccount);
    }

    async getTransactionById(account_id: number): Promise<BankAccountTransaction[]> {
        const transaction = await this.transactionsRepository.find({ where: { account: { account_id: account_id } } });
        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${account_id} not found`);
        }
        return transaction;
    }

    async createTransactionAndAdjustBalance(
        createTransactionDto: CreateBankAccountTransactionDto
    ): Promise<BankAccountTransaction> {
        ///getacc
        const account = await this.getAccount(createTransactionDto.account_id);

        const transaction = new BankAccountTransaction();
        transaction.transaction_type = createTransactionDto.transaction_type;
        transaction.amount = createTransactionDto.amount;
        transaction.currency = createTransactionDto.currency;
        transaction.description = createTransactionDto.description;
        transaction.account = account;

        if (account.currency === createTransactionDto.currency) {
            if (transaction.transaction_type === 'deposit') {
                account.balance += (transaction.amount);

            } else if (transaction.transaction_type === 'withdraw') {
                if (account.balance > 0 && account.balance >= transaction.amount)
                    account.balance -= (transaction.amount);
                else
                    throw new BadRequestException('Acount Balance not sufficient');
            }
        }

        else {
            console.log('converting');
            const convertedAmount = await this.convertCurrency(account.currency, createTransactionDto.currency, createTransactionDto.amount);
            console.log(convertedAmount, 'val')

            if (transaction.transaction_type === 'deposit') {
                account.balance += convertedAmount;

            } else if (transaction.transaction_type === 'withdraw') {
                if (account.balance > 0 && account.balance >= transaction.amount)
                    account.balance -= convertedAmount;
                else
                    throw new BadRequestException('Acount Balance not sufficient');
            }
        }
        await this.transactionsRepository.save(transaction);
        await this.bankAccountRepository.save(account);
        return transaction;
    }

    //oneAccountToOther
    async Transfer(
        fromid: number,
        createTransactionDto: CreateBankAccountTransactionDto

    ): Promise<BankAccountTransaction> {
        //from
        const fromaccount = await this.getAccount(fromid);
        ///to
        const toaccount = await this.getAccount(createTransactionDto.account_id);

        // //error handling        
        if (createTransactionDto.currency != fromaccount.currency) {
            throw new BadRequestException(`${fromaccount.currency}  account cannot transfer ${createTransactionDto.currency}`)
        }
        if (fromaccount.balance < createTransactionDto.amount) {
            throw new BadRequestException('Acount Balance not sufficient')
        }

        const transaction = new BankAccountTransaction();
        transaction.transaction_type = createTransactionDto.transaction_type;
        transaction.amount = createTransactionDto.amount;
        transaction.currency = createTransactionDto.currency;
        transaction.description = createTransactionDto.description;
        transaction.account = toaccount;

        if (createTransactionDto.currency === toaccount.currency) {
            if (transaction.transaction_type === 'transfer') {
                fromaccount.balance -= transaction.amount;
                toaccount.balance += transaction.amount;
            }
            else
                throw new BadRequestException('transaction type not defined')
        }
        else {
            console.log('converting');
            const convertedAmount = await this.convertCurrency(toaccount.currency, createTransactionDto.currency, createTransactionDto.amount);
            console.log(convertedAmount, 'val')

            if (transaction.transaction_type === 'transfer') {
                fromaccount.balance -= transaction.amount;
                toaccount.balance += convertedAmount;
            }
            else
                throw new BadRequestException('transaction type not defined')
        }
        await this.transactionsRepository.save(transaction);
        await this.bankAccountRepository.save(toaccount);
        await this.bankAccountRepository.save(fromaccount);
        return transaction;
    }

    ///exchnage rates
    async getRates() {

        const rates = await axios.get(ratesApiUrl)

        if (!rates) {

            throw new BadRequestException('Invalid currency codes');
        }
        console.log(rates.data.rates);
        return rates.data.rates;
    }
    //conversion
    async convertCurrency(toCurrency: string, fromCurrency: string, amount: number) {

        const rates = await this.getRates();

        if (!rates[fromCurrency] || !rates[toCurrency]) {
            throw new BadRequestException('Invalid currency codes');
        }
        const convertedAmount = (amount / rates[fromCurrency]) * rates[toCurrency];
        return convertedAmount;

    }
    
    async getAccount(accountId: number): Promise<BankAccount> {
        const account = await this.bankAccountRepository.findOne({
            where: { account_id: accountId }
        });

        if (!account) {
            throw new NotFoundException(`Account ${accountId} not found`);
        }
        return account;
    }
}
