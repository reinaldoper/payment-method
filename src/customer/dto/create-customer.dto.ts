import { IsEmail, IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678900' })
  @IsString()
  document: string;

  @ApiProperty({ example: '+55 67 99999-0000' })
  @IsPhoneNumber('BR')
  phone: string;
}
