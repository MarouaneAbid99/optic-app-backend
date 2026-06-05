import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { InsuranceStatus } from '@prisma/client';

export class UpdateInsuranceFileDto {
  @IsEnum(InsuranceStatus)
  @IsOptional()
  status?: InsuranceStatus;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsNumber()
  @IsOptional()
  claimedAmount?: number;

  @IsNumber()
  @IsOptional()
  reimbursedAmount?: number;

  @IsDateString()
  @IsOptional()
  submittedAt?: string;

  @IsDateString()
  @IsOptional()
  reimbursedAt?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
