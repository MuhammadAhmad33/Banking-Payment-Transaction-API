import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BankAccount } from './bank-account.entity';

@Entity()
export class BankAccountTransaction {
  @PrimaryGeneratedColumn()
  transaction_id: number ;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  transaction_date: Date;

  @Column({nullable:false})
  transaction_type: string;

  @Column({default:'USD'})
  currency: string;

  @Column({ nullable: false})
  amount: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => BankAccount, (account) => account.transactions)
  @JoinColumn({ name: 'account_id' })  
  account: BankAccount;
}