import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePrescriptionDto {
  @IsInt()
  clientId: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  doctor?: string;

  @IsNumber()
  @IsOptional()
  odSphere?: number;

  @IsNumber()
  @IsOptional()
  odCylinder?: number;

  @IsNumber()
  @IsOptional()
  odAxis?: number;

  @IsNumber()
  @IsOptional()
  odAddition?: number;

  @IsNumber()
  @IsOptional()
  ogSphere?: number;

  @IsNumber()
  @IsOptional()
  ogCylinder?: number;

  @IsNumber()
  @IsOptional()
  ogAxis?: number;

  @IsNumber()
  @IsOptional()
  ogAddition?: number;

  @IsNumber()
  @IsOptional()
  pd?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
