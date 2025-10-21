import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsInt,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CreateChargeDto {
  @ApiProperty({ example: 150.0 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'BRL' })
  @IsString()
  currency: string;

  @ApiProperty({ enum: PaymentMethod, example: 'PIX' })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: 1 })
  @IsInt()
  customerId: number;

  @ApiProperty({ example: '2025-10-30T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  installments?: number;

  @ApiProperty({ example: 'chave@pix.com.br', required: false })
  @IsOptional()
  @IsString()
  pixKey?: string;

  @ApiProperty({ example: 'qrCode123', required: false })
  @IsOptional()
  @IsString()
  qrCode?: string;
}
