-- Criar enum Role
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- Adicionar role como TEXT primeiro (sem enum)
ALTER TABLE "users" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'USER';

-- Adicionar active em users
ALTER TABLE "users" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

-- Adicionar category em products com default temporário
ALTER TABLE "products" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Outros';

-- Adicionar active em products
ALTER TABLE "products" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

-- Remover o default TEXT antes de converter para enum
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;

-- Converter para enum
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role" USING "role"::"Role";

-- Redefinir default como enum
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER'::"Role";