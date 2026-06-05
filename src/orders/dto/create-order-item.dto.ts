import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @IsOptional()
  productId?: number;

  @IsString()
  label: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;
}
