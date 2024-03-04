import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBankAccountTransactionDto {
  @IsNotEmpty()
  @IsString()
  transaction_type: string;

  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  account_id: number;
}

  
  export class BankAccountTransactionDto {
    transaction_id: number;
    transaction_date: Date;
    transaction_type: string;
    amount: number;
    currency:string;
    description?: string;
    account_id: number;
  }