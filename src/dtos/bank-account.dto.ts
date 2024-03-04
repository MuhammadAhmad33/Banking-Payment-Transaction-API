import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBankAccountDto {

  @IsString()
  @IsNotEmpty()
  account_number: string;

  @IsString()
  account_type?: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  balance?: number;

  @IsNumber()
  @IsNotEmpty()
  bank_id: number;

}
  
  export class BankAccountDto {
    account_id: number;
    account_number: string;
    account_type?: string;
    balance: number;
    currency:string;
    bank_id: number;
  }
  