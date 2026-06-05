import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @IsEnum(ProductType)
  type: ProductType;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  costPrice: number;

  @IsNumber()
  @Min(0)
  sellPrice: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  minStock?: number;

  @IsInt()
  @IsOptional()
  supplierId?: number;
}
