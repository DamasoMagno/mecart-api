# MeCart API

API REST para gerenciamento de usuários, carrinhos e produtos do projeto **MeCart**.

## Sumário

- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Execução do projeto](#execução-do-projeto)
- [Scripts disponíveis](#scripts-disponíveis)
- [Autenticação](#autenticação)
- [Rotas da API](#rotas-da-api)

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JSON Web Token (JWT)
- Bcrypt
- Zod
- Tsx
- Tsup

## Requisitos

- Node.js **18+**
- npm
- Banco PostgreSQL em execução

## Configuração do ambiente

1. Clone o repositório.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie o arquivo `.env` com base no `.env.example`:

   ```env
   DATABASE_URL=
   PORT=
   SECRET_KEY=
   ```

4. Gere o client do Prisma:

   ```bash
   npx prisma generate
   ```

5. Aplique as migrations (ou use seu fluxo atual de banco):

   ```bash
   npx prisma migrate dev
   ```

## Execução do projeto

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## Scripts disponíveis

- `npm run dev`: inicia a API em modo desenvolvimento com reload.
- `npm run build`: gera build da aplicação em `dist/`.
- `npm start`: executa a versão compilada.

## Autenticação

Após login, use o token JWT no header `Authorization`:

```http
Authorization: ******
```

## Rotas da API

Base local sugerida: `http://localhost:3333`

### Usuário (`/user`)

- `POST /user` — cria um usuário.
- `POST /user/login` — autentica e retorna token JWT.

### Carrinho (`/cart`) *(rotas protegidas)*

- `GET /cart` — lista carrinhos do usuário autenticado (filtro opcional por `title`).
- `GET /cart/:cartId` — busca um carrinho específico.
- `GET /cart/:cartId/products` — lista produtos de um carrinho.
- `POST /cart` — cria carrinho.
- `PATCH /cart/:cartId` — atualiza carrinho.
- `DELETE /cart/:cartId` — remove carrinho.

### Produto (`/product`) *(rotas protegidas)*

- `GET /product/:productId` — busca produto por ID.
- `POST /product` — cria produto.
- `PATCH /product/:productId` — atualiza produto.
- `DELETE /product/:productId` — remove produto.