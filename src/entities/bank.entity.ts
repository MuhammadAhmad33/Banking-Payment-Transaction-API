import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BankAccount } from './bank-account.entity';

@Entity()
export class Bank {
  @PrimaryGeneratedColumn()
  bank_id: number;

  @Column({nullable:false})
  bank_name: string;

  @OneToMany(() => BankAccount, (account) => account.bank)
  accounts: BankAccount[];
}


