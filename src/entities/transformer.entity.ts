import { ValueTransformer } from 'typeorm';

export class DecimalColumnTransformer implements ValueTransformer {
  // Method to convert data from TypeScript to the database
  to(data: number): string {
    return data.toFixed(3); // Convert the number to a string with two decimal places
  }

  // Method to convert data from the database to TypeScript
  from(data: string): number {
    return parseFloat(data); // Parse the string and convert it to a floating-point number
  }
}