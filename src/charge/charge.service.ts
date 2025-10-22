import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  BoletoChargeDto,
  CreateChargeDto,
  CreditCardChargeDto,
  PixChargeDto,
} from './dto/create-charge.dto';
import { ChargeStatus, PaymentMethod } from '@prisma/client';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ChargeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChargeDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });

    await this.paymentMethod(dto);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const existing = await this.prisma.charge.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
    });

    if (existing) {
      throw new ConflictException('Cobrança com essa chave já existe');
    }

    return this.prisma.charge.create({
      data: {
        ...dto,
        status: ChargeStatus.PENDING,
      },
    });
  }

  async paymentMethod(dto: CreateChargeDto) {
    try {
      switch (dto.method) {
        case PaymentMethod.PIX:
          await validateOrReject(plainToInstance(PixChargeDto, dto));
          break;
        case PaymentMethod.CREDIT_CARD:
          await validateOrReject(plainToInstance(CreditCardChargeDto, dto));
          break;
        case PaymentMethod.BOLETO:
          await validateOrReject(plainToInstance(BoletoChargeDto, dto));
          break;
        default:
          throw new BadRequestException('Método de pagamento inválido');
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: number) {
    const charge = await this.prisma.charge.findUnique({ where: { id } });
    if (!charge) throw new NotFoundException('Cobrança não encontrada');
    return charge;
  }

  async findAll() {
    return this.prisma.charge.findMany({ include: { customer: true } });
  }

  async updateStatus(id: number, status: ChargeStatus) {
    const charge = await this.prisma.charge.findUnique({ where: { id } });
    if (!charge) throw new NotFoundException('Cobrança não encontrada');
    return this.prisma.charge.update({
      where: { id },
      data: { status },
    });
  }

  async findByCustomer(customerId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return this.prisma.charge.findMany({
      where: { customerId },
      include: { customer: true },
    });
  }

  async delete(id: number) {
    const charge = await this.prisma.charge.findUnique({ where: { id } });

    if (!charge) {
      throw new NotFoundException('Cobrança não encontrada');
    }

    if (charge.status !== ChargeStatus.PENDING) {
      throw new NotFoundException(
        'Só é possível excluir cobranças com status PENDING',
      );
    }

    return this.prisma.charge.delete({ where: { id } });
  }

  async expireOverdueCharges() {
    const now = new Date();

    const result = await this.prisma.charge.updateMany({
      where: {
        method: PaymentMethod.BOLETO,
        status: ChargeStatus.PENDING,
        dueDate: { lt: now },
      },
      data: {
        status: ChargeStatus.EXPIRED,
      },
    });

    return {
      expiredCount: result.count,
      message: `${result.count} boletos vencidos foram expirados.`,
    };
  }

  async findPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.charge.findMany({
        skip,
        take: limit,
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.charge.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}
