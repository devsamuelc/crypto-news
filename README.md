```md
# 🪙 Crypto News API

API RESTful desenvolvida com NestJS para cadastro de usuários e fornecimento de dados atualizados de criptomoedas. Os dados são sincronizados periodicamente com a CoinGecko, armazenados localmente em banco de dados PostgreSQL e servidos via endpoints públicos.

## 🚀 Tecnologias Utilizadas

- **Node.js / TypeScript**
- **NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **JWT (Autenticação)**
- **@nestjs/schedule** (cron job)
- **Axios** (para chamadas HTTP)
- **Swagger (OpenAPI)**

## 📦 Funcionalidades

### Usuários

- Registro de usuários com e-mail/senha
- Login com JWT
- Suporte a múltiplos dispositivos e sessões com refresh tokens (em desenvolvimento)
- Proteção de rotas com roles (`admin`, `user`, etc)

### Criptomoedas

- Consumo da CoinGecko para obter:
  - Nome da cripto
  - Market Cap
  - Variação 24h / 7d
  - Valor mais alto / mais baixo
  - Valor atual
- Sincronização periódica via cron job
- Persistência local em banco
- Endpoints para consulta pública

### Internacionalização (i18n)

- Suporte a múltiplos idiomas nos componentes frontend relacionados (em outros repositórios)

## 🗂 Estrutura de Pastas (Backend)

```

src/
├── auth/             # Autenticação (JWT, guards, refresh tokens)
├── user/             # Módulo de usuários
├── crypto/           # Módulo de criptomoedas
├── common/           # DTOs, interceptors, decorators, etc.
├── prisma/           # PrismaService
├── scheduler/        # Cron job para sincronização com CoinGecko
└── main.ts

````

## 🛠 Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/crypto-news.git
cd crypto-news

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env

# Gere o client do Prisma
npx prisma generate

# Rode as migrações
npx prisma migrate dev --name init

# Inicie o projeto
npm run start:dev
````

## 🔐 Endpoints de Autenticação

```
POST /auth/register      # Cadastro
POST /auth/login         # Login e recebimento de JWT
POST /auth/refresh       # (opcional) Refresh token
```

## 📈 Endpoints de Criptomoedas

```
GET /cryptos                     # Lista criptos disponíveis
GET /cryptos/:id                 # Detalhes de uma cripto
GET /cryptos/:id/updates         # Histórico da cripto
```

## 🧪 Testes

```bash
# Testes unitários e2e nos endpoints principais
npm run test
```

## 📅 Agendamento via Cron

A sincronização com a CoinGecko roda periodicamente (por exemplo, a cada hora) usando o módulo `@nestjs/schedule`. O cron job busca os dados de todas as criptomoedas cadastradas e atualiza a base local.

## 📄 Licença

MIT

```
