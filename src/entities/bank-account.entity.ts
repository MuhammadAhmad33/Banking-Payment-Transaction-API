import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Bank } from './bank.entity';
import { BankAccountTransaction } from './bank-account-transaction.entity';
import { DecimalColumnTransformer } from './transformer.entity';

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn()
  account_id: number;

  @Column({ unique: true })
  account_number: string;

  @Column({ nullable: false })
  account_type: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  balance: number;


  @ManyToOne(() => Bank, (bank) => bank.accounts)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @OneToMany(() => BankAccountTransaction, (transaction) => transaction.account)
  transactions: BankAccountTransaction[];
}
