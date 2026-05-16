# 🛒 Mini E-commerce

Aplicação Full Stack de um Mini E-commerce com CRUD completo de **Usuários** e **Produtos**.

---

## 🚀 Tecnologias

### Backend
- **Node.js** + **TypeScript**
- **Express** — framework HTTP
- **Prisma ORM** — acesso ao banco de dados
- **PostgreSQL** — banco de dados relacional
- **Jest** + **Supertest** — testes automatizados

### Frontend
- **React** + **TypeScript**
- **Vite** — build tool
- **Axios** — cliente HTTP
- **React Router DOM** — navegação entre páginas

---

## 📋 Funcionalidades

### Usuários
- ✅ Listar todos os usuários
- ✅ Cadastrar novo usuário (nome, e-mail, senha)
- ✅ Editar usuário
- ✅ Excluir usuário
- ✅ Validações: e-mail único, senha mínima de 8 caracteres
- ✅ Senha nunca retornada nas respostas da API

### Produtos
- ✅ Listar todos os produtos
- ✅ Cadastrar novo produto (nome, descrição, preço, estoque)
- ✅ Editar produto
- ✅ Excluir produto
- ✅ Validações: preço e estoque não negativos
- ✅ Badge de estoque colorido (sem estoque / baixo / disponível)

---

## 🗂️ Estrutura do Projeto

```
mini-ecommerce/
├── backend/
│   ├── src/
│   │   ├── routes/          # Rotas da API
│   │   ├── controllers/     # Recebe requests, delega para services
│   │   ├── services/        # Lógica de negócio
│   │   ├── dtos/            # Tipagem de entrada e saída
│   │   ├── middlewares/     # Error handler global
│   │   ├── config/          # Configuração do Prisma
│   │   ├── server.ts        # Configuração do Express
│   │   └── index.ts         # Ponto de entrada
│   ├── prisma/
│   │   └── schema.prisma    # Schema do banco de dados
│   └── tests/
│       ├── unit/            # Testes unitários dos services
│       └── integration/     # Testes de integração das rotas
└── frontend/
    └── src/
        ├── components/      # Componentes reutilizáveis (Modal, Forms)
        ├── modules/         # Features por domínio (users, products)
        ├── services/        # Chamadas à API
        ├── types/           # Interfaces TypeScript
        └── utils/           # Utilitários
```

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [PostgreSQL](https://www.postgresql.org/) instalado e rodando
- npm v9 ou superior

---

## 🔧 Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/mini-ecommerce.git
cd mini-ecommerce
```

### 2. Configurar o Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend/`:

```bash
copy .env.example .env
```

Edite o `.env` com suas credenciais do PostgreSQL:

```env
PORT=3333
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/mini_ecommerce"
```

Crie o banco de dados no PostgreSQL:

```sql
CREATE DATABASE mini_ecommerce;
```

Execute as migrations:

```bash
npx prisma migrate dev --name init
```

Inicie o servidor:

```bash
npm run dev
```

O backend estará disponível em: `http://localhost:3333`

---

### 3. Configurar o Frontend

Abra um novo terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

---

## 🧪 Testes

```bash
cd backend
npm test
```

Resultado esperado: **47 testes passando** em 4 suites.

```bash
npm run test:coverage
```

---

## 📡 Endpoints da API

### Health Check
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/health` | Verifica se o servidor está rodando |

### Usuários
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/users` | Lista todos os usuários |
| GET | `/api/v1/users/:id` | Busca usuário por ID |
| POST | `/api/v1/users` | Cria novo usuário |
| PUT | `/api/v1/users/:id` | Atualiza usuário |
| DELETE | `/api/v1/users/:id` | Remove usuário |

### Produtos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/products` | Lista todos os produtos |
| GET | `/api/v1/products/:id` | Busca produto por ID |
| POST | `/api/v1/products` | Cria novo produto |
| PUT | `/api/v1/products/:id` | Atualiza produto |
| DELETE | `/api/v1/products/:id` | Remove produto |

---

## 📦 Exemplos de Requisição

### Criar Usuário
```json
POST /api/v1/users
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Criar Produto
```json
POST /api/v1/products
{
  "name": "Tênis Nike Air Max",
  "description": "Tênis esportivo",
  "price": 299.90,
  "stock": 10
}
```

---

## 🚨 Padrão de Erros

Todos os erros seguem o formato:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "A senha deve ter no mínimo 8 caracteres",
    "timestamp": "2024-01-29T10:30:00Z",
    "path": "/api/v1/users"
  }
}
```

| Código | Status | Descrição |
|--------|--------|-----------|
| `VALIDATION_ERROR` | 400 | Dados inválidos |
| `NOT_FOUND` | 404 | Recurso não encontrado |
| `CONFLICT` | 409 | Conflito (ex: e-mail duplicado) |
| `INTERNAL_ERROR` | 500 | Erro interno do servidor |

---

## 🗄️ Banco de Dados

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 👨‍💻 Autor

Desenvolvido como projeto de aprendizado Full Stack — Mini E-commerce.
