import { IsEmail, IsOptional, IsString, IsPhoneNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'João Silva' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'joao@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '12345678900' })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiPropertyOptional({ example: '+55 67 99999-0000' })
  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;
}
