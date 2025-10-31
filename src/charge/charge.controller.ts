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
import {
  BoletoChargeDto,
  CreditCardChargeDto,
  PixChargeDto,
} from './dto/create-charge.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ChargeStatus } from '@prisma/client';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Charge')
@Controller('charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}

  @Post()
  @ApiExtraModels(PixChargeDto, CreditCardChargeDto, BoletoChargeDto)
  @ApiOperation({
    summary: 'Criar nova cobrança',
    description:
      'Para criar uma cobrança, o idempotencyKey deve ser único para cada tentativa de criação. Se uma cobrança com a mesma chave já existir, uma exceção de conflito será lançada.',
  })
  @ApiResponse({ status: 201, description: 'Cobrança criada com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Cobrança com essa chave já existe',
  })
  @ApiBody({
    description: 'Dados da cobrança conforme o método de pagamento',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(PixChargeDto) },
        { $ref: getSchemaPath(CreditCardChargeDto) },
        { $ref: getSchemaPath(BoletoChargeDto) },
      ],
    },
  })
  /**
   * Criar nova cobrança.
   *
   * @param dto - Dados da cobrança conforme o método de pagamento.
   * @returns - A cobrança criada com sucesso.
   * @throws ConflictException - Se uma cobrança com a mesma chave já existir.
   * @throws BadRequestException - Se a cobrança não for encontrada.
   * @throws NotFoundException - Se o cliente não for encontrado.
   */
  async create(
    @Body() dto: PixChargeDto | CreditCardChargeDto | BoletoChargeDto,
  ) {
    return this.chargeService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cobrança por ID' })
  @ApiResponse({ status: 200, description: 'Cobrança encontrada' })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
  /**
   * Buscar cobrança por ID.
   *
   * @param id - O ID da cobrança a serem buscada.
   * @returns - A cobrança encontrada.
   * @throws NotFoundException - Se a cobrança não for encontrada.
   */
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.chargeService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as cobranças' })
  @ApiResponse({ status: 200, description: 'Lista de cobranças' })
  /**
   * Listar todas as cobranças.
   *
   * @returns - A lista de todas as cobranças.
   */
  async findAll() {
    return this.chargeService.findAll();
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Listar cobranças por cliente' })
  @ApiParam({ name: 'customerId', type: Number })
  @ApiResponse({ status: 200, description: 'Cobranças do cliente' })
  /**
   * Buscar cobranças por cliente.
   *
   * @param customerId - O ID do cliente a serem buscado.
   * @returns - A lista de cobranças do cliente.
   * @throws NotFoundException - Se o cliente não for encontrado.
   */
  async findByCustomer(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.chargeService.findByCustomer(customerId);
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Atualizar status da cobrança' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'status', enum: ChargeStatus })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  /**
   * Atualizar status da cobrança.
   *
   * @param id - O ID da cobrança a ser atualizada.
   * @param status - O novo status da cobrança.
   * @returns - A cobrança com o status atualizado.
   * @throws NotFoundException - Se a cobrança não for encontrada.
   * @throws BadRequestException - Se o status for inválido.
   */
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
  /**
   * Excluir cobrança por ID.
   *
   * @param id - O ID da cobrança a ser excluída.
   * @returns - A cobrança excluída com sucesso.
   * @throws NotFoundException - Se a cobrança não for encontrada.
   * @throws BadRequestException - Se a cobrança não está com status PENDING.
   */
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.chargeService.delete(id);
  }

  @Post('expire-overdue')
  @ApiOperation({ summary: 'Expirar boletos vencidos' })
  @ApiResponse({ status: 200, description: 'Boletos expirados com sucesso' })
  /**
   * Expirar boletos vencidos.
   * Este endpoint busca por boletos com status PENDING e data de vencimento menor ou igual a data atual.
   * Se encontrar algum, o status é atualizado para EXPIRED.
   * O endpoint retorna um objeto com a propriedade expiredCount, que contém a quantidade de boletos expirados.
   * @returns {Promise<{ expiredCount: number }>}
   */
  async expireOverdueCharges() {
    return this.chargeService.expireOverdueCharges();
  }

  @Post('paginated')
  @ApiOperation({ summary: 'Listar cobranças com paginação' })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Cobranças paginadas' })
  /**
   * Listar cobranças com paginação.
   * Este endpoint lista todas as cobranças, com paginação.
   * Os parâmetros page e limit podem ser informados, para controlar a paginação.
   * Se page for omitido, a paginação começa na página 1.
   * Se limit for omitido, a paginação usa o valor padrão de 10 itens por página.
   * @param {PaginationDto} query - Parâmetros de paginação.
   * @returns {Promise<{ data: Charge[], total: number, page: number, limit: number, pages: number }>} - Cobranças paginadas.
   */
  async findPaginated(@Query() query: PaginationDto) {
    return this.chargeService.findPaginated(query.page, query.limit);
  }
}
