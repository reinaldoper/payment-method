import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ChargeService } from './charge.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ChargeStatus } from '@prisma/client';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Charge')
@Controller('charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova cobrança' })
  @ApiResponse({ status: 201, description: 'Cobrança criada com sucesso' })
  async create(@Body() dto: CreateChargeDto) {
    return this.chargeService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cobrança por ID' })
  @ApiResponse({ status: 200, description: 'Cobrança encontrada' })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.chargeService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as cobranças' })
  @ApiResponse({ status: 200, description: 'Lista de cobranças' })
  async findAll() {
    return this.chargeService.findAll();
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Listar cobranças por cliente' })
  @ApiParam({ name: 'customerId', type: Number })
  @ApiResponse({ status: 200, description: 'Cobranças do cliente' })
  async findByCustomer(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.chargeService.findByCustomer(customerId);
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Atualizar status da cobrança' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'status', enum: ChargeStatus })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: ChargeStatus,
  ) {
    return this.chargeService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir cobrança por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Cobrança excluída com sucesso' })
  @ApiResponse({ status: 400, description: 'Cobrança não está pendente' })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.chargeService.delete(id);
  }

  @Post('expire-overdue')
  @ApiOperation({ summary: 'Expirar boletos vencidos' })
  @ApiResponse({ status: 200, description: 'Boletos expirados com sucesso' })
  async expireOverdueCharges() {
    return this.chargeService.expireOverdueCharges();
  }

  @Post('paginated')
  @ApiOperation({ summary: 'Listar cobranças com paginação' })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Cobranças paginadas' })
  async findPaginated(@Query() query: PaginationDto) {
    return this.chargeService.findPaginated(query.page, query.limit);
  }
}
