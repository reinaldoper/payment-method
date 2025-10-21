# 💳 API de Pagamentos — NestJS + Prisma

Sistema de pagamentos simplificado com suporte a Pix, Cartão de Crédito e Boleto Bancário. Permite o cadastro de clientes e a criação de cobranças vinculadas a esses clientes.

---

## 🚀 Tecnologias Utilizadas

- NodeJs >= 22
- [NestJS](https://nestjs.com/) — Framework Node.js com arquitetura modular
- [Prisma ORM](https://www.prisma.io/) — ORM para banco de dados relacional
- [PostgreSQL](https://www.postgresql.org/) — Banco de dados relacional
- [Class Validator](https://github.com/typestack/class-validator) — Validação de DTOs
- [Swagger](https://swagger.io/) — Documentação interativa da API
- [Docker](https://www.docker.com/) — Container Docker
- [Helmet](https://helmetjs.github.io/) — Helmet, proteção com requisições do header

---

## 📦 Instalação e Execução

### 1. Clone o projeto

```bash
git clone https://github.com/reinaldoper/payment-method.git
cd payment-method
npm install
```

### 2. Configure o banco de dados

- Crie um arquivo .env com as variáveis:

```bash
DATABASE_URL="postgresql://myuserpayment:mypayment@localhost:5432/mydatabase?schema=public"
PORT=3001
```

### 3. Rode o banco de dados com o Docker

```bash
docker compose up -d
```

### 4. Execute as migrations

```bash
npx prisma migrate dev --name init
```

### 5. Rode a aplicação

```bash
npm run start:dev
```

### 6. Acesse a documentação Swagger

```bash
http://localhost:3001/api/docs
```

📚 Endpoints da API


🔹 Customer

| Método | Rota            | Descrição                     |
|--------|------------------|-------------------------------|
| POST   | `/customer`      | Criar novo cliente            |
| GET    | `/customer/:id`  | Buscar cliente por ID         |
| GET    | `/customer`      | Listar todos os clientes      |
| PATCH  | `/customer/:id`  | Atualizar dados do cliente    |
| DELETE | `/customer/:id`  | Excluir cliente               |


🔹 Charge


| Método | Rota                                           | Descrição                                 |
|--------|------------------------------------------------|--------------------------------------------|
| POST   | `/charge`                                      | Criar nova cobrança                        |
| GET    | `/charge/:id`                                  | Buscar cobrança por ID                     |
| GET    | `/charge`                                      | Listar todas as cobranças                  |
| GET    | `/charge/customer/:customerId`                 | Listar cobranças de um cliente específico  |
| POST    | `/charge/paginated?page=1&limit=10`            | Listar cobranças com paginação             |
| PATCH  | `/charge/:id/status/:status`                   | Atualizar status da cobrança               |
| POST   | `/charge/expire-overdue`                       | Expirar boletos vencidos                   |
| DELETE | `/charge/:id`                                  | Excluir cobrança (somente se pendente)     |



🧠 Regras de Negócio:

- Um cliente não pode ter email ou documento duplicado
- Uma cobrança só pode ser excluída se estiver com status PENDING
- Boletos vencidos são automaticamente expirados via endpoint
- Pagamentos podem ser atualizados para PAID, FAILED, EXPIRED


🛠️ Estrutura de Pastas

```bash

src/
├── customer/
│   ├── dto/
│   ├── customer.controller.ts
│   ├── customer.service.ts
├── charge/
│   ├── dto/
│   ├── charge.controller.ts
│   ├── charge.service.ts
├── prisma/
│   ├── prisma.service.ts
├── app.module.ts

```

### 7. A aplicação estara rodando no seguinte endpoint.

```bash
http://localhost:3001/api/

```