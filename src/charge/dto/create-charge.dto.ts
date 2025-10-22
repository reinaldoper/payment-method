import {
  IsEnum,
  IsNumber,
  IsDateString,
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { Expose } from 'class-transformer';

export class CreateChargeDto {
  @ApiProperty({ example: 150.0 })
  @Expose()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'BRL' })
  @Expose()
  @IsString()
  currency: string;

  @ApiProperty({ enum: PaymentMethod, example: 'PIX' })
  @Expose()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: 1 })
  @Expose()
  @IsInt()
  customerId: number;

  @ApiProperty({ example: 'key123' })
  @Expose()
  @IsString()
  idempotencyKey: string;
}

export class CreditCardChargeDto {
  @ApiProperty({ example: 150.0 })
  @Expose()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'BRL' })
  @Expose()
  @IsString()
  currency: string;

  @ApiProperty({ enum: PaymentMethod, example: 'CREDIT_CARD' })
  @Expose()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: 1 })
  @Expose()
  @IsInt()
  customerId: number;

  @ApiProperty({ example: 'key123' })
  @Expose()
  @IsString()
  idempotencyKey: string;

  @ApiProperty({ example: 1 })
  @Expose()
  @IsInt()
  @Min(1)
  installments: number;
}

export class PixChargeDto {
  @ApiProperty({ example: 150.0 })
  @Expose()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'BRL' })
  @Expose()
  @IsString()
  currency: string;

  @ApiProperty({ enum: PaymentMethod, example: 'PIX' })
  @Expose()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: 1 })
  @Expose()
  @IsInt()
  customerId: number;

  @ApiProperty({ example: 'key123' })
  @Expose()
  @IsString()
  idempotencyKey: string;

  @ApiProperty({ example: '123456789' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  pixKey: string;

  @ApiProperty({ example: 'QRCodeStringHere' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  qrCode: string;
}

export class BoletoChargeDto {
  @ApiProperty({ example: 150.0 })
  @Expose()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'BRL' })
  @Expose()
  @IsString()
  currency: string;

  @ApiProperty({ enum: PaymentMethod, example: 'BOLETO' })
  @Expose()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: 1 })
  @Expose()
  @IsInt()
  customerId: number;

  @ApiProperty({ example: 'key123' })
  @Expose()
  @IsString()
  idempotencyKey: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @Expose()
  @IsDateString()
  dueDate: string;
}
