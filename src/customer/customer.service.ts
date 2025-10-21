import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    const exists = await this.prisma.customer.findFirst({
      where: {
        OR: [{ email: dto.email }, { document: dto.document }],
      },
    });

    if (exists) {
      throw new ConflictException('Cliente já cadastrado');
    }

    return this.prisma.customer.create({ data: dto });
  }

  async findById(id: number) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Cliente não encontrado');
    return customer;
  }

  async findAll() {
    return this.prisma.customer.findMany();
  }

  async update(id: number, dto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Cliente não encontrado');

    return this.prisma.customer.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Cliente não encontrado');

    return this.prisma.customer.delete({ where: { id } });
  }
}
