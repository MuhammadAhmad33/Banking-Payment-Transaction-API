import { IsNotEmpty } from "class-validator";

export class CreateBankDto {
  @IsNotEmpty()
  bank_name: string;
  }
  
  export class BankDto {
    bank_id: number;
    bank_name: string;
  }
  