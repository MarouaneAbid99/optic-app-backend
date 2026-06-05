import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { InsuranceProvider, InsuranceStatus } from '@prisma/client';

export class CreateInsuranceFileDto {
  @IsInt()
  clientId: number;

  @IsInt()
  @IsOptional()
  orderId?: number;

  @IsEnum(InsuranceProvider)
  provider: InsuranceProvider;

  @IsEnum(InsuranceStatus)
  @IsOptional()
  status?: InsuranceStatus;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsNumber()
  @IsOptional()
  claimedAmount?: number;

  @IsDateString()
  @IsOptional()
  submittedAt?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
