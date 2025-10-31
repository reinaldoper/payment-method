import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email ou documento já cadastrado' })
  /**
   * Cadastrar novo cliente.
   *
   * @param dto - Dados do cliente a serem cadastrado.
   * @returns - O cliente cadastrado.
   * @throws ConflictException - Se o email ou documento do cliente j   cadastrado.
   */
  async create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  /**
   * Buscar cliente por ID.
   *
   * @param id - O ID do cliente a serem buscado.
   * @returns - O cliente encontrado.
   * @throws NotFoundException - Se o cliente não for encontrado.
   */
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  /**
   * Listar todos os clientes.
   *
   * @returns - A lista de todos os clientes cadastrados.
   */
  async findAll() {
    return this.customerService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do cliente' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  /**
   * Atualizar dados do cliente.
   *
   * @param id - O ID do cliente a serem atualizado.
   * @param dto - Os dados do cliente a serem atualizados.
   * @returns - O cliente atualizado.
   * @throws NotFoundException - Se o cliente não for encontrado.
   */
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir cliente por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Cliente excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  /**
   * Excluir cliente por ID.
   *
   * @param id - O ID do cliente a ser excluído.
   * @returns - O cliente excluído com sucesso.
   * @throws NotFoundException - Se o cliente não for encontrado.
   */
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.delete(id);
  }
}
