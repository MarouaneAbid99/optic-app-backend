import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsInt()
  orderId: number;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsDateString()
  @IsOptional()
  paidAt?: string;
}
